import client from "../client"
import follow from "../follow"
//загружает только те записи, которые никто не редактирует
function load(pageSize,sortBy,sortOrder){
    //параметризируем сортировку и размер страниц
    let params = {size: pageSize};
    if(sortBy != "undefined" && sortOrder != "undefined")
        params.sort = sortBy + "," + sortOrder;
    //получаем данные
    let that = {schema : {}};
    follow(client, "/api/v1/", [
        {rel: 'concretePages', params: params}]
    ).then(pageCollections => {
        //получаем схему
        return client({
            method: 'GET',
            path: pageCollections.entity._links.profile.href,
            headers: {'Accept': 'application/schema+json'}
        }).then(schema => {
            that.schema = schema.entity;
            return pageCollections;
        });
        //устанавливаем текущее состояние
    }).done(pagesCollections => {
        let buff = updateContent(pagesCollections,Object.keys(that.schema.properties).filter(x=>x!=='id'),params);
        reducer(null,{type:"LOAD_PAGES_ACCEPT" ,result:buff });
    });
}


function updateContent(collection,attributes,params){
       return {
           concretePages: collection.entity._embedded.concretePages,
           attributes: attributes,
           page: collection.entity.page,
           links: collection.entity._links,
           params: params
       }
}

let reducer = function(state, action) {
    switch (action.type) {
        case "PAGE_ADDING":
            console.log("reducer PAGE_ADDING");
            state.fetching = false;
            return state;
        case "PAGE_DELETING":
            console.log("reducer PAGE_DELETING");
            state.fetching = false;
            return state;
        case "PAGE_UPDATING":
            console.log("reducer PAGE_UPDATING");
            state.fetching = false;
            return state;
        case "LOAD_PAGES":
            switch(action.state){
                case "start":
                    console.log("reducer LOAD_PAGES loading");
                    state.fetching = false;
                    return state;
                case "finish" :
                    console.log("reducer LOAD_PAGES loaded");
                    action.fetching = true;
                    return action.result;
            }
            return state;

    }
    return state;
};

export default reducer;
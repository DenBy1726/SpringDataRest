import follow from '../follow'
import client from '../client'
import actions from './action'

const root = "/api/v1/";


export function loadWithSchema(size, sortBy, sortOrder) {
    return function (dispatch) {
        let params = makeParams(size,sortBy,sortOrder);
        let that = {};
        dispatch(actions.pageLoading());
        return loadData(params)
            .then(collections=>{
                return loadSchema(collections)
                    .then(schema => {
                        that.schema = schema.entity;
                        return collections;
                })
            }
        )
            .done(collections=>{
                dispatch(actions.pageLoaded(collections, Object.keys(that.schema.properties).filter(x => x !== 'id'), params))
        });
    }
}

export function load(attributes,params){
    return function (dispatch) {

        dispatch(actions.pageLoading());

        return loadData(params)
            .done(collections=>{
                dispatch(actions.pageLoaded(collections, attributes, params))
            });
    }
}

function loadSchema(pageCollections){
    return client({
        method: 'GET',
        path: pageCollections.entity._links.profile.href,
        headers: {'Accept': 'application/schema+json'}
    });
}

function loadData(params) {
    return follow(client, root, [
        {rel: 'concretePages', params: params}]
    );
}

function makeParams(size,sortBy,sortOrder){
    let params = {size: size};
    if (sortBy != "undefined" && sortOrder != "undefined")
        params.sort = sortBy + "," + sortOrder;
    return params;
}


export function create(newPage,attributes,params){
    //отправляем на сервер данное
    return function (dispatch) {
        dispatch(actions.pageAdding());
        client({
            method: 'POST',
            path: root + "concretePages",
            entity: newPage,
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            //получаем обновленные данные(обновлены страницы, ссылки)
            return follow(client, root, [
                {rel: 'concretePages', params: params}]);
        }).done(response => {
            let href;
            if (typeof response.entity._links.last != "undefined")
                href = response.entity._links.last.href;
            else
                href = response.entity._links.self.href;
           dispatch(navigate(href,attributes,params));
        });
    }
}

export function navigate(url,attributes,params){
    return function (dispatch) {
        dispatch(actions.pageLoading());
        client({method: 'GET', path: url}).done(pagesCollections => {
            dispatch(actions.pageLoaded(pagesCollections, attributes, params));
        });
    }
}

export function Delete(url,attributes,params){
    return function (dispatch) {
        dispatch(actions.pageDeleting());
        client({method: 'DELETE', path: url}).done(response => {
                dispatch(load(attributes,params));
        });
    }
}

export function update(page,updatedPage,attributes,params) {
    return function (dispatch) {
        actions.pageUpdating();
        client({
            method: 'PUT',
            path: page._links.self.href,
            entity: updatedPage,
            headers: {
                'Content-Type': 'application/json',
            }
        }).done(response => {
            dispatch(load(attributes,params));
        });
    }
}


export function updateState(collection,attributes,params){
    return {
        concretePages: collection.entity._embedded.concretePages,
        attributes: attributes,
        page: collection.entity.page,
        links: collection.entity._links,
        params: params
    }
}

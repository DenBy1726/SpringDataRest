import follow from '../../follow'
import client from '../../client'
import actions from './actionEvents'

const root = "/api/v1/";

//загружает данные и схему
export function loadWithSchema(page,sorter) {
    return function (dispatch) {
        return loadSchema()
            .then(schema=>{
                dispatch(load(Object.keys(schema.entity.properties).filter(x => x !== 'id'),page,sorter));
            })
    }
}

//загружает только данные
export function load(attributes,page,sorter){
    return function (dispatch) {

        let pParams = paramsFromPage(page);
        let sParams = paramsFromSorter(sorter);
        let params = combineParams(pParams,sParams);

        dispatch(actions.pageLoading());
        return loadData(params)
            .done(collections=>{
                dispatch(actions.pageLoaded(collections, attributes, params))
            });
    } 
}

//загрузка схемы
function loadSchema(){
    return client({
        method: 'GET',
        path: root + "profile/concretePages",
        headers: {'Accept': 'application/schema+json'}
    });
}

//загрузка данных
function loadData(params) {
    return follow(client, root, [
        {rel: 'concretePages', params: params}]
    );
}


//предобработка параметров пагинации
function paramsFromPage(page){
    if(page.current === undefined)
        page.current = 1;
   return {size: page.pageSize, page: page.current-1};
}

//предобработка параметров сортировки
function paramsFromSorter(sorter){
    if(sorter !== undefined && sorter.order !== undefined && sorter.field !== undefined)
        return {sort : sorter.field + "," +sorter.order};
}

//комбинирование параметров
function combineParams(obj,obj2){
    return Object.assign(obj,obj2);
}


//запрос на добавление
export function create(newPage,attributes,page){
    //отправляем на сервер данное
    return function (dispatch) {
        dispatch(actions.pageAdding());
        client({
            method: 'POST',
            path: root + "concretePages",
            entity: newPage,
            headers: {'Content-Type': 'application/json'}
        }).done(response => {
            page.current = Math.ceil((page.total + 1)/page.pageSize);
            dispatch(load(attributes,page));
        });
    }
}


// запрсо на удаление
export function Delete(url,attributes,params){
    return function (dispatch) {
        dispatch(actions.pageDeleting());
        client({method: 'DELETE', path: url}).done(response => {
                dispatch(load(attributes,params));
        });
    }
}

//запрос на модификацию
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

//обновление данных
export function updateState(collection,attributes){
    return {
        data: collection.entity._embedded.concretePages,
        attributes: attributes,
        page: {
            current: collection.entity.page.number + 1,
            pageSize: collection.entity.page.size,
            total: collection.entity.page.totalElements
        }
    }
}

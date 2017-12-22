import follow from '../../api/follow'
import request from '../../api/request'
import actions from './actionEvents'

const root = "/api/v1/";

//загружает данные и схему
export function loadWithSchema(page,sorter) {
    return function (dispatch) {
        return loadSchema()
            .then(schema=>{
                if(schema !== undefined)
                    dispatch(load(Object.keys(schema.entity.properties).filter(x => x !== 'id' && x !=='register_on'),page,sorter));
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
            .then(collections=>{
                if(collections !== undefined)
                    dispatch(actions.pageLoaded(collections, attributes, params))
            })
    } 
}

//загрузка схемы
function loadSchema(){
    return request({
        method: 'GET',
        path: root + "profile/users",
        headers: {'Accept': 'application/schema+json'}
    });
}

//загрузка данных
function loadData(params) {
    return request({
    method: 'GET',
    path: root + "users{?page,size,sort}",
    params: params
});
   /* return follow(request, root, [
        {rel: 'users', params: params}]
    );*/
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
export function create(newPage,attributes,page,sorter){
    //отправляем на сервер данное
    return function (dispatch) {
        dispatch(actions.pageAdding());
        request({
            method: 'POST',
            path: root + "users",
            entity: newPage,
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            page.current = Math.ceil((page.total + 1)/page.pageSize);
            dispatch(load(attributes,page,sorter));
        });
    }
}


// запрсо на удаление
export function Delete(url,attributes,page,sorter){
    return function (dispatch) {
        dispatch(actions.pageDeleting());
        request({method: 'DELETE', path: url}).done(response => {
                dispatch(load(attributes,page,sorter));
        });
    }
}

//запрос на модификацию
export function update(page,updatedPage,attributes,pageParam,sorter) {
    return function (dispatch) {
        actions.pageUpdating();
        request({
            method: 'PATCH',
            path: page._links.self.href,
            entity: updatedPage,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            if(response) {
                dispatch(load(attributes, pageParam, sorter));
                this.props.history.push("/list");
            }
        });
    }
}

//обновление данных
export function updateState(collection,attributes){
    return {
        data: collection.entity._embedded.users,
        attributes: attributes,
        page: {
            current: collection.entity.page.number + 1,
            pageSize: collection.entity.page.size,
            total: collection.entity.page.totalElements
        }
    }
}

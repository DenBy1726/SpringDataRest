import follow from '../follow'
import client from '../client'
import actions from './action'

const root = "/api/v1/";

export function load(size,sortBy,sortOrder) {

    // Thunk middleware знает, как обращаться с функциями.
    // Он передает метод действия в качестве аргумента функции,
    // т.к. это позволяет отправить действие самостоятельно.

    return function (dispatch) {

        // Первая отправка: состояние приложения обновлено,
        // чтобы сообщить, что запускается вызов API.

        dispatch(actions.pageLoading());

        // Функция, вызываемая Thunk middleware, может возвращать значение,
        // которое передается как возвращаемое значение метода dispatch.

        // В этом случае мы возвращаем Promise.
        // Thunk middleware не требует этого, но это удобно для нас.
        let params = {size: size};
        if (sortBy != "undefined" && sortOrder != "undefined")
            params.sort = sortBy + "," + sortOrder;

        let that = {schema: {}};
        return follow(client, root, [
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
            dispatch(actions.pageLoaded(pagesCollections, Object.keys(that.schema.properties).filter(x => x !== 'id'), params))
        });
    }
}

export function create(newPage,attributes,params){
    //отправляем на сервер данное
    return function (dispatch) {
        dispatch(actions.addPage());
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
        client({method: 'GET', path: url}).done(pagesCollections => {
            dispatch(actions.pageLoaded(pagesCollections, attributes, params));
        });
    }
}

export function Delete(url,attributes,params){
    return function (dispatch) {
        dispatch(actions.pageDeleting());
        client({method: 'DELETE', path: url}).done(response => {
                dispatch(load(params.size, params.sortBy, params.sortOrder));
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
            dispatch(load(params.size, params.sortBy, params.sortOrder));
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

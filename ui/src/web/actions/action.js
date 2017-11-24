import {loadWithSchema,updateState,create,navigate,Delete,update} from "./actionFunc"

//событие начала добавления страницы
//если успешно то вызовет LOAD_PAGES:finish
export function pageAdding() {
    return {
        type: "PAGE_ADDING",
    }
}

//событие начала удаления страницы
//если успешно то вызовет LOAD_PAGES:finish
export function pageDeleting() {
    return {
        type: "PAGE_DELETING",
    }
}

//событие начала обновления страницы
//если успешно то вызовет LOAD_PAGES:finish
export function pageUpdating() {
    return {
        type: "PAGE_UPDATING",
    }
}

//событие начала загрузки данных.(в том числе и схемы)
//если успешно то вызывает LOAD_PAGES:finish
export function pageLoading() {
    return {
        type: "LOAD_PAGES",
        state: 'start'
    }
}

//событие завершения загрузки данных.
export function pageLoaded(collection,attributes,params){
    return {
        type: "LOAD_PAGES",
        result: updateState(collection,attributes,params),
        state: 'finish'
    }
}

export function loadPages(size,sortBy,sortOrder) {
    return loadWithSchema(size,sortBy,sortOrder);
}

export function createPage(page,attributes,params){
    return create(page,attributes,params);
}

export function navigatePage(url, attributes, params){
    return navigate(url,attributes,params);
}

export function deletePage(url, attributes, params){
    return Delete(url,attributes,params);
}

export function updatePage(page,newPage,attributes,params){
    return update(page,newPage,attributes,params);
}

export default {createPage,deletePage,updatePage,loadPages,navigatePage,pageUpdating,pageDeleting,pageAdding,pageLoading,pageLoaded}
































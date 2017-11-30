import {updateState} from "./actionFunc"

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
export function pageLoaded(collection,attributes){
    return {
        type: "LOAD_PAGES",
        result: updateState(collection,attributes),
        state: 'finish'
    }
}

export default {pageLoading,pageLoaded,pageAdding,pageDeleting,pageUpdating}
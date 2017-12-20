import {updateState} from "./actionFunc"

export function request() {
    return {
        type: "ROLE_REQUEST",
    }
}

//событие завершения загрузки данных.
export function response(collection){
    return {
        type: "ROLE_RESPONSE",
        result: updateState(collection),
    }
}

export default {request,response}
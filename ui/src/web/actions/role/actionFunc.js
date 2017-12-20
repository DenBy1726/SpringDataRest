import requestAPI from '../../api/request'
import actions from './actionEvents'

export function request(){
    return function(dispatch){
        actions.request();
        return requestAPI({
            method: 'GET',
            path: "/auth/v1/me",
            headers: {'Content-Type': 'application/json'},
        }).then(x=>{
            dispatch(actions.response(x));
        });
    }
}

//обновление данных
export function updateState(collection){
    return {
        user: collection.entity,
    }
}

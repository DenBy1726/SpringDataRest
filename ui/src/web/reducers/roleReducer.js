const initialState = {user: {}, fetching:false};

let roleReducer = function(state = initialState, action) {
    switch (action.type) {
       case "ROLE_REQUEST":
           action = {...state};
           action.fetching = false;
           return action;
        case "ROLE_RESPONSE":
            action = {...state,user:action.result.user};
            action.fetching = true;
            return action;
        default:
            return state;
    }
};

export default roleReducer;
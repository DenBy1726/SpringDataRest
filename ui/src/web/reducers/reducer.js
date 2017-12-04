
let concretePages = function(state, action) {
    switch (action.type) {
        case "PAGE_ADDING":
            console.log("data PAGE_ADDING");
            state.fetching = false;
            return state;
        case "PAGE_DELETING":
            console.log("data PAGE_DELETING");
            state.fetching = false;
            return state;
        case "PAGE_UPDATING":
            console.log("data PAGE_UPDATING");
            state.fetching = false;
            return state;
        case "LOAD_PAGES":
            switch(action.state){
                case "start":
                    console.log("data LOAD_PAGES loading");
                    action = {...state};
                    action.fetching = false;
                    return action;
                case "finish" :
                    console.log("data LOAD_PAGES loaded");
                    action.result.fetching = true;
                    return action.result;
            }
            return state;
        default:
            const initialState = {data: [], attributes: [], page: {}, links: {}, fetching:false};
            return initialState;
    }
};

export default concretePages;
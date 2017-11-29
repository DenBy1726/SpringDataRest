
let concretePages = function(state, action) {
    switch (action.type) {
        case "PAGE_ADDING":
            console.log("concretePages PAGE_ADDING");
            state.fetching = false;
            return state;
        case "PAGE_DELETING":
            console.log("concretePages PAGE_DELETING");
            state.fetching = false;
            return state;
        case "PAGE_UPDATING":
            console.log("concretePages PAGE_UPDATING");
            state.fetching = false;
            return state;
        case "LOAD_PAGES":
            switch(action.state){
                case "start":
                    console.log("concretePages LOAD_PAGES loading");
                    state.fetching = false;
                    return state;
                case "finish" :
                    console.log("concretePages LOAD_PAGES loaded");
                    action.result.fetching = true;
                    return action.result;
            }
            return state;
        default:
            let size = 10;
            if(localStorage.getItem('pageSize') != null)
                size = Number.parseInt(localStorage.getItem('pageSize'));
            const initialState = {data: [], attributes: [], page: {size:size}, links: {}, fetching:false};
            return initialState;
    }
};

export default concretePages;

let reducer = function(state, action) {
    switch (action.type) {
        case "PAGE_ADDING":
            console.log("reducer PAGE_ADDING");
            state.fetching = false;
            return state;
        case "PAGE_DELETING":
            console.log("reducer PAGE_DELETING");
            state.fetching = false;
            return state;
        case "PAGE_UPDATING":
            console.log("reducer PAGE_UPDATING");
            state.fetching = false;
            return state;
        case "LOAD_PAGES":
            switch(action.state){
                case "start":
                    console.log("reducer LOAD_PAGES loading");
                    state.fetching = false;
                    return state;
                case "finish" :
                    console.log("reducer LOAD_PAGES loaded");
                    action.result.fetching = true;
                    return action.result;
            }
            return state;

    }
    return state;
};

export default reducer;
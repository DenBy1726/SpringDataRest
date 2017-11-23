'use strict';
import ReactDOM from 'react-dom'
import React from 'react'
import Table from './components/Table'
let redux = require("redux");
let Provider = require("react-redux").Provider;
import reducer from "./reducers/reducer.js"
import thunk from 'redux-thunk' // <-- добавили redux-thunk

let size = 10;
if(localStorage.getItem('pageSize') != null)
    size = Number.parseInt(localStorage.getItem('pageSize'));
let initialState = {concretePages: [], attributes: [], page: {size:size}, links: {}, fetching:false};

//связь хранилища с функцией обновления состояния.
let store = redux.createStore(reducer,initialState,redux.applyMiddleware(thunk));

//отправка запроса на инициализацию (установка первоначального состояния)
store.dispatch({
    type: "LOAD_PAGES",
    size: 8,
    sortBy: "title",
    sortOrder: "desc"

});

    ReactDOM.render(
        <Provider store={store}>
            <Table/>
        </Provider>,
        document.getElementById("root")
    );

'use strict';
import ReactDOM from 'react-dom'
import React from 'react'
import Table from './components/obsolete/Table'
let redux = require("redux");
let Provider = require("react-redux").Provider;
import reducer from "./reducers/reducer.js"
import thunk from 'redux-thunk' // <-- добавили redux-thunk
import {applyMiddleware} from "redux"
import App from "./components/App"
import ruRU from 'antd/lib/locale-provider/ru_RU';
import LocaleProvider from "antd"

let size = 10;
if(localStorage.getItem('pageSize') != null)
    size = Number.parseInt(localStorage.getItem('pageSize'));
let initialState = {concretePages: [], attributes: [], page: {size:size}, links: {}, fetching:false};

//связь хранилища с функцией обновления состояния.
let store = redux.createStore(reducer,initialState,applyMiddleware(thunk));


    ReactDOM.render(
        <Provider store={store}>
                <App/>
        </Provider>,
        document.getElementById("root")
    );

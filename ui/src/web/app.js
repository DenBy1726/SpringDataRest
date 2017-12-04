'use strict';
import ReactDOM from 'react-dom'
import React from 'react'
import Table from './components/obsolete/Table'
let redux = require("redux");
let Provider = require("react-redux").Provider;
import concretePages from "./reducers/reducer.js"
import thunk from 'redux-thunk' // <-- добавили redux-thunk
import {applyMiddleware} from "redux"
import App from "./components/App"
import ruRU from 'antd/lib/locale-provider/ru_RU';
import LocaleProvider from "antd"
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
// import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import {createBrowserHistory} from 'history';

import {BrowserRouter,Switch,Route} from "react-router-dom";
import MainPage from "./components/MainPage";
import AppMenu from "./components/AppMenu";



const combineReducer = redux.combineReducers({
    concretePages: concretePages,
    routing: routerReducer
});

//связь хранилища с функцией обновления состояния.
let store = redux.createStore(combineReducer,applyMiddleware(thunk));

const history = syncHistoryWithStore(createBrowserHistory(), store);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App history={history}/>
        </BrowserRouter>
    </Provider>
    ,
    document.getElementById("root"));

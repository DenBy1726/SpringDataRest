'use strict';
import ReactDOM from 'react-dom'
import React from 'react'
import Table from './components/Table'

let request = new XMLHttpRequest();
request.open('GET', '/api/v1/concretePages', true);
request.send(null);
request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
        let type = request.getResponseHeader('Content-Type');
        if (type.indexOf("text") !== 1) {
            let json = request.responseText;
            const data = JSON.parse(json);
            console.log(json);
            ReactDOM.render(
                <Table data={data._embedded.concretePages}/>,
                document.getElementById("root"));
        }
    }
};

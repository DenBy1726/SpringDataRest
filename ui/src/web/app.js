'use strict';
import ReactDOM from 'react-dom'
import React from 'react'
import Table from './components/Table'
import client from './client'

/*let request = new XMLHttpRequest();
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
};*/

client('GET','/api/v1/concretePages').then(data=>{
    ReactDOM.render(
        <Table data={data._embedded.concretePages}/>,
        document.getElementById("root"));
});

import React from "react"
import RowCollections from "./RowCollections"
import follow from '../follow'
import client from '../client'
import TableSchema from "./TableSchema";

export default class Table extends React.Component{
    constructor(props){
        super(props);
        this.state = {concretePages: [], attributes: [], pageSize: 2, links: {}};
    }

    componentDidMount() {
        //грузим данные с сервера, устанавливаем размер страницы
        this.loadFromServer(this.state.pageSize);
    }

    loadFromServer(pageSize) {
        //получаем данные
        follow(client, "/api/v1/", [
            {rel: 'concretePages', params: {size: pageSize}}]
        ).then(employeeCollection => {
            //получаем схему
            return client({
                method: 'GET',
                path: employeeCollection.entity._links.profile.href,
                headers: {'Accept': 'application/schema+json'}
            }).then(schema => {
                this.schema = schema.entity;
                return employeeCollection;
            });
            //устанавливаем текущее состояние
        }).done(employeeCollection => {
            this.setState({
                //данные
                concretePages: employeeCollection.entity._embedded.concretePages,
                //схема
                attributes: Object.keys(this.schema.properties).filter(x=>x!=='id'),
                //размер страницы
                pageSize: pageSize,
                //ссылки на страницы в т.ч. пагинация
                links: employeeCollection.entity._links});
        });
    }

    render(){
        return <table>
                   <TableSchema data={this.state.attributes}/>
                   <RowCollections data={this.state.concretePages}/>
               </table>
    }
}
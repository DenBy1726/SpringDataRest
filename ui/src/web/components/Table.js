import React from "react"
import RowCollections from "./RowCollections"
import follow from '../follow'
import client from '../client'
import TableSchema from "./TableSchema";
import CreateDialog from "./CreateDialog"

const root = "/api/v1/";

export default class Table extends React.Component{
    constructor(props){
        super(props);
        this.state = {concretePages: [], attributes: [], pageSize: 10, links: {}};

        this.onCreate = this.onCreate.bind(this);
        this.updateContent = this.updateContent.bind(this);
    }

    componentDidMount() {
        //грузим данные с сервера, устанавливаем размер страницы
        this.loadFromServer(this.state.pageSize);
    }

    //добавить запись
    onCreate(newPage){
        //отправляем на сервер данное
        client({
                method: 'POST',
                path: root +"concretePages" ,
                entity: newPage,
                headers: {'Content-Type': 'application/json'}
        }).then(response => {
            //получаем обновленные данные(обновлены страницы, ссылки)
            return follow(client, root, [
                {rel: 'concretePages', params: {'size': this.state.pageSize}}]);
        }).done(response => {
            //получаем запись по нужной ссылке(нужную страницу)
            if (typeof response.entity._links.last != "undefined") {
                this.onNavigate(response.entity._links.last.href);
            } else {
                this.onNavigate(response.entity._links.self.href);
            }
        });
    }

    onNavigate(navUri) {
        client({method: 'GET', path: navUri}).done(pagesCollections => {
            this.updateContent(pagesCollections,this.state.attributes);
        });
    }

    updateContent(collection,attributes){
        this.setState({
            concretePages: collection.entity._embedded.concretePages,
            attributes: attributes,
            pageSize: this.state.pageSize,
            links: collection.entity._links
        });
    }

    loadFromServer(pageSize) {
        //получаем данные
        follow(client, root, [
            {rel: 'concretePages', params: {size: pageSize}}]
        ).then(pageCollections => {
            //получаем схему
            return client({
                method: 'GET',
                path: pageCollections.entity._links.profile.href,
                headers: {'Accept': 'application/schema+json'}
            }).then(schema => {
                this.schema = schema.entity;
                return pageCollections;
            });
            //устанавливаем текущее состояние
        }).done(pagesCollections => {
            this.updateContent(pagesCollections,Object.keys(this.schema.properties).filter(x=>x!=='id'));
        });
    }

    render(){
        return <div>
            <CreateDialog title="Добавить страницу" attributes={this.state.attributes} onCreate={this.onCreate}/>
            <table>
                       <TableSchema data={this.state.attributes}/>
                       <RowCollections data={this.state.concretePages}/>
            </table>
        </div>
    }
}
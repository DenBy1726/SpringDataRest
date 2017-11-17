import React from "react"
import RowCollections from "./RowCollections"
import follow from '../follow'
import client from '../client'
import TableSchema from "./TableSchema";
import CreateDialog from "./CreateDialog"
import NavBar from "./NavBar"

const root = "/api/v1/";

export default class Table extends React.Component{
    constructor(props){
        super(props);
        this.state = {concretePages: [], attributes: [], page: {size:10}, links: {}};

        console.log(localStorage.getItem('pageSize'));
        if(localStorage.getItem('pageSize') != null)
            this.state.page.size = Number.parseInt(localStorage.getItem('pageSize'));

        this.onCreate = this.onCreate.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
        this.changePageSize = this.changePageSize.bind(this);
        this.sort = this.sort.bind(this);
    }

    componentDidMount() {
        //грузим данные с сервера, устанавливаем размер страницы
        this.loadFromServer(this.state.page.size,"title","desc");
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
                {rel: 'concretePages', params: {'size': this.state.page.size}}]);
        }).done(response => {
            //получаем запись по нужной ссылке(нужную страницу)
            if (typeof response.entity._links.last != "undefined") {
                this.onNavigate(response.entity._links.last.href,this.state.attributes);
            } else {
                this.onNavigate(response.entity._links.self.href,this.state.attributes);
            }
        });
    }

    onNavigate(navUri,attributes) {
        client({method: 'GET', path: navUri}).done(pagesCollections => {
            this.updateContent(pagesCollections,attributes);
        });
    }

    updateContent(collection,attributes){
        console.log(collection);
        this.setState({
            concretePages: collection.entity._embedded.concretePages,
            attributes: attributes,
            page: collection.entity.page,
            links: collection.entity._links
        });
    }

    loadFromServer(pageSize,sortBy,sortOrder) {
        let params = {size: pageSize};
        if(sortBy != "undefined" && sortOrder != "undefined")
            params.sort = sortBy + "," + sortOrder;
        //получаем данные
        follow(client, root, [
            {rel: 'concretePages', params: params}]
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

    sort(sortBy,sortOrder){
        this.loadFromServer(this.state.page.size,sortBy,sortOrder);
    }

    changePageSize(pageSize){
        if (pageSize !== this.state.page.size) {
            this.loadFromServer(pageSize);
            localStorage.setItem('pageSize',pageSize.toString());
        }
    }

    render(){
        return <div>
            <CreateDialog title="Добавить страницу" attributes={this.state.attributes} onCreate={this.onCreate}/>
            <table>
                       <TableSchema data={this.state.attributes} sort={this.sort}/>
                       <RowCollections data={this.state.concretePages}/>
            </table>
            <NavBar links={this.state.links} onNavigate={this.onNavigate} attributes={this.state.attributes} page={this.state.page}
                changePageSize={this.changePageSize}/>
        </div>
    }
}
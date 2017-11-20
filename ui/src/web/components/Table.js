import React from "react"
import RowCollections from "./RowCollections"
import follow from '../follow'
import client from '../client'
import TableSchema from "./TableSchema";
import CreateDialog from "./CreateDialog"
import NavBar from "./NavBar"
import ApplyDialog from "./ApplyDialog"
import UpdateDialog from "./UpdateDialog"
import when from 'when';

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
        this.onDelete = this.onDelete.bind(this);
        this.submitDeletion = this.submitDeletion.bind(this);
        this.loadUnsafe = this.loadUnsafe.bind(this);
        this.loadSafe = this.loadSafe.bind(this);
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


    onUpdate(page, updatedPage) {
        client({
            method: 'PUT',
            path: page.entity._links.self.href,
            entity: updatedPage,
            headers: {
                'Content-Type': 'application/json',
                'If-Match': page.headers.Etag
            }
        }).done(response => {
            this.loadFromServer(this.state.page.size);
        }, response => {
            if (response.status.code === 412) {
                alert('DENIED: Unable to update ' +
                    page.entity._links.self.href + '. Your copy is stale.');
            }
        });
    }

    onNavigate(navUri,attributes) {
        client({method: 'GET', path: navUri}).done(pagesCollections => {
            this.updateContent(pagesCollections,attributes);
        });
    }

    onDelete(page){
        client({method: 'DELETE', path: page._links.self.href}).done(response => {
            this.loadFromServer(this.state.page.size);
        });
    }

    submitDeletion(page){
        let that = this;
        this.refs.modal.open("Вы уверены?")
            .then(function() {
                that.onDelete(page);
            })
            .fail(function() {
                // Отмена
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

    loadUnsafe(params){
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

    //загружает только те записи, которые никто не редактирует
    loadSafe(params){
        let pageCollectionsBuffer = [];
        //запрос на получение страниц
        follow(client, root, [
            {rel: 'concretePages', params: params}])
            .then(pagesCollection => {
                return client({
                    method: 'GET',
                    path: pagesCollection.entity._links.profile.href,
                    //заголовок для получения схемы
                    headers: {'Accept': 'application/schema+json'}
                }).then(schema => {
                    console.log(schema);
                    this.schema = schema.entity;
                    this.links = pagesCollection.entity._links;
                    return pagesCollection;
                });
            }).then(pagesCollection => {
            //получаем ссылки для каждой записи из текущей страницы
            pageCollectionsBuffer = pagesCollection;
            return pagesCollection.entity._embedded.concretePages.map(page => {
                    return client({
                        method: 'GET',
                        path: page._links.self.href
                    })
                }
            );
            //промис на проверку не редактирует ли кто либо запись
        }).then(pagePromise => {
            return when.all(pagePromise);
        }).done(pages => {
            this.updateContent(pageCollectionsBuffer,Object.keys(this.schema.properties).filter(x=>x!=='id'));
        });
    }

    loadFromServer(pageSize,sortBy,sortOrder) {
        //параметризируем сортировку и размер страниц
        let params = {size: pageSize};
        if(sortBy != "undefined" && sortOrder != "undefined")
            params.sort = sortBy + "," + sortOrder;

        this.loadSafe(params);

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
            <UpdateDialog title="Редактировать страницу" attributes={this.state.attributes} onUpdate={this.onCreate} data={this.state.concretePages[0]}/>
            <ApplyDialog text="Вы действительно хотите удалить эту запись?" ref="modal"/>
            <CreateDialog title="Добавить страницу" attributes={this.state.attributes} onCreate={this.onCreate}/>

            <table>

                       <TableSchema data={this.state.attributes} sort={this.sort}/>
                       <RowCollections data={this.state.concretePages} delete={this.submitDeletion}/>

            </table>
            <NavBar links={this.state.links} onNavigate={this.onNavigate} attributes={this.state.attributes} page={this.state.page}
                changePageSize={this.changePageSize}/>
        </div>
    }
}
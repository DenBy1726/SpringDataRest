import React from "react"
import RowCollections from "./RowCollections"
import follow from '../follow'
import client from '../client'
import TableSchema from "./TableSchema";
import NavBar from "./NavBar"
import ModalDialog from "./ModalDialog"
import when from 'when';

const root = "/api/v1/";

export default class Table extends React.Component{
    constructor(props){
        super(props);
        this.state = {concretePages: [], attributes: [], page: {size:10}, links: {}};

        if(localStorage.getItem('pageSize') != null)
            this.state.page.size = Number.parseInt(localStorage.getItem('pageSize'));

        this.onCreate = this.onCreate.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
        this.changePageSize = this.changePageSize.bind(this);
        this.sort = this.sort.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.submitDelete = this.submitDelete.bind(this);
        this.load = this.load.bind(this);
        this.submitAdd = this.submitAdd.bind(this);
        this.submitEdit = this.submitEdit.bind(this);
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
            path: page._links.self.href,
            entity: updatedPage,
            headers: {
                'Content-Type': 'application/json',
            }
        }).done(response => {
            this.loadFromServer(this.state.page.size);
        }, response => {
            if (response.status.code === 412) {
                alert('DENIED: Unable to update ' +
                    page._links.self.href + '. Your copy is stale.');
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

    updateContent(collection,attributes){
        this.setState({
            concretePages: collection.entity._embedded.concretePages,
            attributes: attributes,
            page: collection.entity.page,
            links: collection.entity._links
        });
    }

    //загружает только те записи, которые никто не редактирует
    load(params){
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

    loadFromServer(pageSize,sortBy,sortOrder) {
        //параметризируем сортировку и размер страниц
        let params = {size: pageSize};
        if(sortBy != "undefined" && sortOrder != "undefined")
            params.sort = sortBy + "," + sortOrder;

        this.load(params);

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

    submitAdd(){
        let that = this;
        this.refs.addModal.open("Добавление записи")
            .then(page =>  that.onCreate(page))
            .fail(function() {
                // Отмена
            });
    }

    submitEdit(page){
        let that = this;
        this.refs.editModal.open("Редактирование записи","",page)
            .then(newpage=> that.onUpdate(page,newpage))
            .fail(function() {
                // Отмена
            });
    }

    submitDelete(page){
        let that = this;
        this.refs.modal.open("Вы действительно хотите удалить эту запись?")
            .then(function() {
                that.onDelete(page);
            })
            .fail(function() {
                // Отмена
            });
    }

    render(){
        return <div>
            <ModalDialog attributes={this.state.attributes} ref="editModal" />
            <ModalDialog ref="modal"/>
            <ModalDialog attributes={this.state.attributes} ref="addModal"/>
            <button  id="addPageLink" className="fa fa-plus" onClick={this.submitAdd}/>
            <table>
                       <TableSchema data={this.state.attributes} sort={this.sort}/>
                       <RowCollections data={this.state.concretePages} delete={this.submitDelete} edit={this.submitEdit}/>

            </table>
            <NavBar links={this.state.links} onNavigate={this.onNavigate} attributes={this.state.attributes} page={this.state.page}
                changePageSize={this.changePageSize}/>
        </div>
    }
}
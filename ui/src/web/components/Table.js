import React from "react"
import RowCollections from "./RowCollections"
import follow from '../follow'
import client from '../client'
import TableSchema from "./TableSchema";
import NavBar from "./NavBar"
import ModalDialog from "./ModalDialog"
import actions from "../actions/action"
let connect = require("react-redux").connect;

const root = "/api/v1/";

class Table extends React.Component{
    constructor(props){
        super(props);

        this.onCreate = this.onCreate.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
        this.changePageSize = this.changePageSize.bind(this);
        this.sort = this.sort.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.submitDelete = this.submitDelete.bind(this);
        this.submitAdd = this.submitAdd.bind(this);
        this.submitEdit = this.submitEdit.bind(this);
    }

    componentDidMount() {
        //грузим данные с сервера, устанавливаем размер страницы
        this.loadFromServer(this.props.page.size,"title","desc");
    }

    //добавить запись
    onCreate(newPage){
        //отправляем на сервер данное
        this.props.createPage(newPage,this.props.attributes,this.props.params);
    }


    onUpdate(page, updatedPage) {
        this.props.updatePage(page,updatedPage,this.props.attributes,this.props.params);
    }

    onNavigate(navUri) {
        this.props.navigatePage(navUri,this.props.attributes,this.props.params);
    }

    onDelete(page){
       this.props.deletePage(page._links.self.href,this.props.attributes,this.props.params);
    }

    loadFromServer(pageSize,sortBy,sortOrder) {
        //параметризируем сортировку и размер страниц
        this.props.loadPages(pageSize,sortBy,sortOrder);
    }

    sort(sortBy,sortOrder){
        this.loadFromServer(this.props.page.size,sortBy,sortOrder);
    }

    changePageSize(pageSize){
        if (pageSize !== this.props.page.size) {
            localStorage.setItem('pageSize',pageSize.toString());
            this.loadFromServer(pageSize);
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
            <ModalDialog attributes={this.props.attributes} ref="editModal" />
            <ModalDialog ref="modal"/>
            <ModalDialog attributes={this.props.attributes} ref="addModal"/>
            <button  id="addPageLink" className="fa fa-plus" onClick={this.submitAdd}/>
            <table>
                       <TableSchema data={this.props.attributes} sort={this.sort}/>
                       <RowCollections data={this.props.concretePages} delete={this.submitDelete} edit={this.submitEdit}/>

            </table>
            <NavBar links={this.props.links} onNavigate={this.onNavigate} attributes={this.props.attributes} page={this.props.page}
                changePageSize={this.changePageSize}/>
        </div>
    }
}

function mapStateToProps(state) {
    return {
        concretePages: state.concretePages,
        attributes: state.attributes,
        page:state.page,
        links:state.links,
        params: state.params,
        fetching: state.fetching
    };
}

//связываем действия и состояние с видом
module.exports = connect(mapStateToProps, actions)(Table);
export default Table;
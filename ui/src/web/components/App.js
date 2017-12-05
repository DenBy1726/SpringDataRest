import React from 'react'
// import ReactDOM from 'react-dom'
import {Table,Icon,Button,Popconfirm,Input} from "antd"
import ModalDialog from "./ModalDialog"
import EditPage from "./EditPage"
import actions from "../actions/concretePages/action"
let connect = require("react-redux").connect;
import { Route, Switch, withRouter, NavLink, Link } from 'react-router-dom';
import AppMenu from "./AppMenu";
import MainPage from "./MainPage";
import AddPage from "./AddPage";
// import ruRU from 'antd/lib/locale-provider/ru_RU';
// import LocaleProvider from "antd"

require('antd/dist/antd.css');


class App extends React.Component{

    constructor(props) {
        super(props);
        this.attributes = [];
        this.page = [];
        this.onNavigate = this.onNavigate.bind(this);
        this.submitAdd = this.submitAdd.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }


    componentDidMount(){
        //грузим данные с сервера, устанавливаем размер страницы
        this.loadFromServer(8,"title","desc");
    }

    shouldComponentUpdate(nextProps, nextState){
        //если пришли не из домена работы со списком, то перезагружаем
        if(this.props.location.pathname.indexOf("list") === -1){
            this.loadFromServer(8,"title","desc");
            return false;
        }
        return true;
    }

    loadFromServer(pageSize,sortBy,sortOrder) {
        //параметризируем сортировку и размер страниц
        this.props.loadAll({pageSize:pageSize},{field:sortBy,order:sortOrder});
    }

    onNavigate(page,filter,sorter) {
        this.props.navigate(page,sorter,this.props.attributes);
    }

    onDelete(page){
        this.props.Delete(page._links.self.href,this.props.attributes,this.props.page);
    }

    submitAdd(){
        let that = this;
        this.refs.addModal.open("Добавление записи")
            .then(page =>  that.onCreate(page))
            .fail(function() {
                // Отмена
            });
    }

    onUpdate(page, updatedPage) {
        //updatedPage.birthday = new Date(updatedPage.birthday).toUTCString();
        this.props.update(page,updatedPage,this.props.attributes,this.props.page);
    }

    //добавить запись
    onCreate(newPage){
        //отправляем на сервер данное
        this.props.create(newPage,this.props.attributes,this.props.page);
    }

    onCancel(){
        this.props.load(this.attributes,this.page);
    }


    render(){
        this.attributes = this.props.attributes;
        this.page = this.props.page;
        console.log(this);
        let columns = this.props.attributes.map(x=> {
            let column = {
                title: x,
                dataIndex: x,
                key: x.id,
                sorter: true
            };

            if (x === "birthday")
                column.render = text => text.toLocaleDateString();

            return column;
        });

        columns.push(
            {
                title: '',
                dataIndex: 'operation',
                width: '20%',
                render: (text, record) => {
                    const deleteButton =
                            <Popconfirm title="Вы уверены что хотите удалить запись?" okText="Да" cancelText="Нет" onConfirm={() => this.onDelete(record)}>
                                <button className="delButton fa fa-times" href="#" />
                            </Popconfirm>;
                    const editButton = <div className="editable-row-operations">
                                            <button className="delButton fa fa-pencil" onClick={()=>this.props.history.push(`/list/Edit/${record.id}`)}/>
                                        </div>;
                    return (
                        <span>
                            {deleteButton}
                            {editButton}
                        </span>
                            );
                }

            });


        let data = this.props.concretePages;
        for (let i in data) {
            data[i].key = i;
            data[i].age = getAge(data[i].birthday);
        }

        return (
            <div>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <Route path = "/">
                        <AppMenu/>
                    </Route>
                    <Switch>
                        <Route exact path="/" >
                            <MainPage/>
                        </Route>
                        <Route exact path="/list/">
                            <div>
                                <Table columns={columns} dataSource={data} loading={!this.props.fetching}
                                       pagination={this.props.page} onChange={this.onNavigate}
                                />
                            </div>
                        </Route>
                        <Route path="/list/Edit/:id">
                            <div style={{width:"100%"}}>
                                <EditPage attributes={this.props.attributes}
                                          data={this.props.concretePages} OK={this.onUpdate} Cancel={this.onCancel}/>
                            </div>
                        </Route>
                        <Route path="/list/Add/">
                            <div style={{width:"100%"}}>
                                <AddPage attributes={this.props.attributes}
                                          OK={this.onCreate} Cancel={this.onCancel}/>
                            </div>
                        </Route>
                    </Switch>
                </div>

            </div>
        )
    }
}

function getAge(date) {
    return new Date().getYear() - date.getYear();
}

function mapStateToProps(state) {
    return {
        //данные
        concretePages: state.concretePages.data,
        //схема
        attributes: state.concretePages.attributes,
        //информация о пагинации
        page:state.concretePages.page,
        fetching: state.concretePages.fetching
    };
}

//связываем действия и состояние с видом
export default withRouter(connect(mapStateToProps, actions)(App));

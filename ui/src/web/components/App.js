import React from 'react'
// import ReactDOM from 'react-dom'
import {Table,Icon,Button,Popconfirm,Input} from "antd"
import ModalDialog from "./ModalDialog"
import EditPage from "./EditPage"
import actions from "../actions/action"
let connect = require("react-redux").connect;
import { Route, Switch, withRouter, NavLink, Link } from 'react-router-dom';
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
        this.loadFromServer(this.props.page.size,"title","desc");
    }

    loadFromServer(pageSize,sortBy,sortOrder) {
        //параметризируем сортировку и размер страниц
        this.props.loadPages(pageSize,sortBy,sortOrder);
    }

    onNavigate(page,filter,sorter) {
        this.props.navigatePage(page,sorter,this.props.attributes);
    }

    onDelete(page){
        this.props.deletePage(page._links.self.href,this.props.attributes,this.props.page);
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
        this.props.updatePage(page,updatedPage,this.props.attributes,this.props.page);
    }

    //добавить запись
    onCreate(newPage){
        //отправляем на сервер данное
        this.props.createPage(newPage,this.props.attributes,this.props.page);
    }

    onCancel(){
        this.props.updateAll(this.attributes,this.page);
    }


    render(){
        this.attributes = this.props.attributes;
        this.page = this.props.page;
        console.log(this);
        let columns = this.props.attributes.map(x=> {
            return {
                title: x,
                dataIndex: x,
                key: x.id,
                sorter: true
            }
        });

        columns.push(
            {
                title: '',
                dataIndex: 'operation',
                width: '10%',
                render: (text, record) => {
                    const deleteButton =
                            <Popconfirm title="Вы уверены что хотите удалить запись?" okText="Да" cancelText="Нет" onConfirm={this.onCancel}>
                                <button className="delButton fa fa-times" href="#" />
                            </Popconfirm>;
                    const editButton = <div className="editable-row-operations">
                                            <button className="delButton fa fa-pencil" onClick={()=>this.props.history.push(`/Edit/${record.id}`)}/>
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
        }

        return (
            <div>
                    <Switch history={this.props.history}>
                            <Route exact path="/">
                                <div>
                                    <ModalDialog attributes={this.props.attributes} ref="addModal"/>
                                    <ModalDialog attributes={this.props.attributes} ref="editModal" />
                                    <Button onClick={this.submitAdd}>Добавить</Button>
                                    <Table columns={columns} dataSource={data} loading={!this.props.fetching}
                                          pagination={this.props.page} onChange={this.onNavigate}
                                           />
                                </div>
                            </Route>
                            <Route path="/Edit/:id">
                                <div>
                                    <EditPage attributes={this.props.attributes}
                                              data={this.props.concretePages} OK={this.onUpdate} Cancel={this.onCancel}/>
                                </div>
                            </Route>
                    </Switch>
            </div>
        )
    }
}



/* <Switch history={this.props.history}>
                            <Route exact path="/">
                                <ModalDialog attributes={this.props.attributes} ref="addModal"/>
                                <ModalDialog attributes={this.props.attributes} ref="editModal" />
                                <Button onClick={this.submitAdd}>Добавить</Button>
                                <Table columns={columns} dataSource={data} loading={!this.props.fetching}
                                      pagination={pagination} onChange={this.onNavigate}
                                       />
                            </Route>
                            <Route path="/Edit/:id">
                                <EditPage attributes={this.props.attributes} data={this.props.concretePages} OK={this.onUpdate} Cancel={()=>{}}/>
                            </Route>
                    </Switch>*/

function mapStateToProps(state) {
    return {
        //данные
        concretePages: state.concretePages.data,
        //схема
        attributes: state.concretePages.attributes,
        //информация о пагинации
        page:state.concretePages.page,
        params: state.concretePages.params,
        fetching: state.concretePages.fetching
    };
}

//связываем действия и состояние с видом
export default withRouter(connect(mapStateToProps, actions)(App));

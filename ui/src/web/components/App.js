import React from 'react'
import {Table,Icon,Button,Popconfirm} from "antd"
import ModalDialog from "./ModalDialog"
import actions from "../actions/action"
let connect = require("react-redux").connect;
import ruRU from 'antd/lib/locale-provider/ru_RU';
import LocaleProvider from "antd"

require('antd/dist/antd.css');

class App extends React.Component{

    constructor(props) {
        super(props);

        this.onNavigate = this.onNavigate.bind(this);
        this.submitAdd = this.submitAdd.bind(this);
        this.submitEdit = this.submitEdit.bind(this);
        this.onCreate = this.onCreate.bind(this);
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
        this.props.deletePage(page._links.self.href,this.props.attributes,this.props.params);
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

    onUpdate(page, updatedPage) {
        this.props.updatePage(page,updatedPage,this.props.attributes,this.props.params);
    }

    //добавить запись
    onCreate(newPage){
        //отправляем на сервер данное
        this.props.createPage(newPage,this.props.attributes,this.props.params);
    }

    render(){
        let columns = this.props.attributes.map(x=> {
            return {
                title: x,
                dataIndex: x,
                key: x,
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
                            <Popconfirm title="Вы уверены что хотите удалить запись?" okText="Да" cancelText="Нет" onConfirm={() => this.onDelete(record)}>
                                <button className="delButton fa fa-times" href="#" />
                            </Popconfirm>;
                    const editButton = <button className="delButton fa fa-pencil" onClick={()=>this.submitEdit(record)}/>

                    return (
                        <span>
                            {deleteButton}{editButton}
                        </span>
                            );
                }

            });


        let data = this.props.concretePages;
        for (let i in data) {
            data[i].key = i;
        }

        let pagination = {total: this.props.page.totalElements};

        if(localStorage.getItem('pageSize') != null)
            pagination.pageSize = Number.parseInt(localStorage.getItem('pageSize'));

        return (
            <div>
                <ModalDialog attributes={this.props.attributes} ref="addModal"/>
                <ModalDialog attributes={this.props.attributes} ref="editModal" />
                <Button onClick={this.submitAdd}>Добавить</Button>
                <Table columns={columns} dataSource={data} loading={!this.props.fetching}
                      pagination={pagination} onChange={this.onNavigate}
                       />
            </div>
        )

    }
}


function mapStateToProps(state) {
    return {
        //данные
        concretePages: state.concretePages,
        //схема
        attributes: state.attributes,
        //информация о пагинации
        page:state.page,
        params: state.params,
        fetching: state.fetching
    };
}

//связываем действия и состояние с видом
module.exports = connect(mapStateToProps, actions)(App);
export default App;
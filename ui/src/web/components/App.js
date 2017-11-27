import React from 'react'
import ReactDOM from 'react-dom'
import {Table,Icon,Button,Popconfirm,Input} from "antd"
import ModalDialog from "./ModalDialog"
import actions from "../actions/action"
let connect = require("react-redux").connect;
import ruRU from 'antd/lib/locale-provider/ru_RU';
import LocaleProvider from "antd"

require('antd/dist/antd.css');


const EditableCell = ({ editable, value,onChange}) => {
    return <div>
        {editable
            ? <Input style={{margin: '-5px 0'}} placeholder={value} onChange={e => onChange(e.target.value)}/>
            : value
        }
    </div>
};

class App extends React.Component{

    constructor(props) {
        super(props);

        this.backup = null;
        this.tempObj = {};
        this.state = {editableId:-1};

        this.onNavigate = this.onNavigate.bind(this);
        this.submitAdd = this.submitAdd.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.edit = this.edit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.save = this.save.bind(this);
        this.renderColumns = this.renderColumns.bind(this);
        this.editTextChanged = this.editTextChanged.bind(this);
    }

    renderColumns(record, column) {
        return (
            <EditableCell
                editable={false}
                value={record[column]}
            />
        );
    }

    editingRenderColumns(record, column) {
        return (
            <EditableCell
                editable={true}
                value={record[column]}
                onChange={(e) => this.editTextChanged(e,column)}
            />
        );
    }

    editTextChanged(e,column){
        this.tempObj[column] = e;
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


    onUpdate(page, updatedPage) {
        this.props.updatePage(page,updatedPage,this.props.attributes,this.props.params);
    }

    edit(key) {
        this.backup = key;
        this.tempObj = {};
        this.setState({editableId: key.id});
    }

    save(){
        this.onUpdate(this.backup,this.tempObj);
        this.setState({editableId: -1});
    }

    cancel(key){
        this.setState({editableId: -1,});
        key = this.backup;
        this.backup = null;
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
                key: x.id,
                sorter: true,
                render: (text,record) => {
                    if(this.state.editableId === record.id) {
                        return this.editingRenderColumns(record, x);
                    }
                    else
                        return this.renderColumns(record, x)}
            }
        });

        columns.push(
            {
                title: '',
                dataIndex: 'operation',
                width: '10%',
                render: (text, record) => {
                    const deleteButton =
                        this.state.editableId === -1 ?
                            <Popconfirm title="Вы уверены что хотите удалить запись?" okText="Да" cancelText="Нет" onConfirm={() => this.onDelete(record)}>
                                <button className="delButton fa fa-times" href="#" />
                            </Popconfirm>
                                : null;
                    const editButton = <div className="editable-row-operations">
                            {
                                this.state.editableId !== -1 ?
                                        <span>
                                          <button className="delButton fa fa-save" onClick={this.save} />
                                          <Popconfirm title="Вы уверены что хотите выйти из режима редактирования?" okText="Да" cancelText="Нет" onConfirm={() => this.cancel(record)}>
                                            <button className="delButton fa fa-ban"/>
                                          </Popconfirm>
                                        </span>
                                    : <button className="delButton fa fa-pencil" onClick={() => this.edit(record)} />
                            }
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
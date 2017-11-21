import React from "react"
import ReactDOM from "react-dom"
import propTypes from "prop-types"

export default class ModalDialog extends React.Component{
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            visible: false,
            cancel_title: this.props.cancel_title ? this.props.cancel_title : 'Нет',
            action_title: this.props.action_title ? this.props.action_title : 'Да',
            title: '',
            text: ''
        };
        this.close = this.close.bind(this);
        this.action = this.action.bind(this);
        this.open = this.open.bind(this);
    }

    // Обработчик закрытия модального окна, вызовет обработчик отказа
    close(){
        this.setState({
            visible: false
        }, function () {
            return this.promise.reject();
        });
    }
    // Обработчик действия модального окна, вызовет обработчик действия
    action(e) {
        let page;
        if(this.props.attributes !== undefined) {
            page = this.handleSubmit(e);
            if (page === undefined)
                return;
        }
        this.setState({
            visible: false
        }, function () {
            return this.promise.resolve(page);
        });
    }
    // Обработчик открытия модального окна. Возвращает promise
    // ( при желании, можно передавать также названия кнопок )
    open(text, title = '',data) {
        this.setState({
            visible: true,
            title: title,
            text: text
        });

        if(data !== undefined && this.props.attributes !== undefined){
            this.props.attributes.forEach(attribute => {
                let node = ReactDOM.findDOMNode(this.refs[attribute]);
                node.value = data[attribute];
            });
        }
        // promise необходимо обновлять при каждом новом запуске окна
        this.promise = new $.Deferred();
        return this.promise;
    }

    handleSubmit(e) {
        e.preventDefault();
        let newPage = {};
        let wasError = false;
        this.props.attributes.forEach(attribute => {
            let node = ReactDOM.findDOMNode(this.refs[attribute]);
            let value = node.value.trim();
            if(value === "") {
                node.className += " validationError";
                wasError = true;
                return;
            }
            else
                node.className = "field";
            newPage[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        if(wasError)
            return;

        // очистить все поля
        this.props.attributes.forEach(attribute => {

            ReactDOM.findDOMNode(this.refs[attribute]).className = "field";
        });

        return newPage;

    }

    render(){

        let modalClass = this.state.visible ? "applyDialog" : "";
        let modalStyles = this.state.visible ? {display: "block"} : {display: "none"};
        let inputs;
        if(this.props.attributes !== undefined) {
            inputs = this.props.attributes.map(x =>
                <p key={x}>
                    <input type="text" placeholder={x} ref={x} className="field"/>
                </p>
            );
        }

        return <div className={modalClass} style={modalStyles}>
            <div>
                <p>{this.state.text}</p>
                {inputs}
                <div>
                    <button type="button" className="submitDialogButton"
                            onClick={this.action}>{this.state.action_title}</button>
                    <button type="button" className="submitDialogButton"
                            onClick={this.close}>{this.state.cancel_title}</button>
                </div>
            </div>
        </div>
    }
}

ModalDialog.propTypes ={
    title : propTypes.string,
    onCreate : propTypes.func,
    data : propTypes.object
};


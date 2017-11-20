import React from "react"
import ReactDOM from "react-dom"
import propTypes from "prop-types"


export default class ApplyDialog extends React.Component{
    constructor(props){
        super(props);
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
    action() {
        this.setState({
            visible: false
        }, function () {
            return this.promise.resolve();
        });
    }
    // Обработчик открытия модального окна. Возвращает promise
    // ( при желании, можно передавать также названия кнопок )
    open(text, title = '') {
        this.setState({
            visible: true,
            title: title,
            text: text
        });

        // promise необходимо обновлять при каждом новом запуске окна
        this.promise = new $.Deferred();
        return this.promise;
    }
    render() {

        let modalClass = this.state.visible ? "applyDialog" : "";
        let modalStyles = this.state.visible ? {display: "block"} : {display: "none"};

        return (
            <div className={modalClass} style={modalStyles}>
                <div>
                    <p>{this.state.text}</p>
                    <div>
                        <button type="button" className="submitDialogButton"
                                onClick={this.action}>{this.state.action_title}</button>
                        <button type="button" className="submitDialogButton"
                                    onClick={this.close}>{this.state.cancel_title}</button>

                    </div>
                </div>
            </div>
        );
    }
};

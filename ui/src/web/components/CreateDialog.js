import React from "react"
import ReactDOM from "react-dom"
import propTypes from "prop-types"

export default class CreateDialog extends React.Component{
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        let newPage = {};
        this.props.attributes.forEach(attribute => {
            newPage[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        this.props.onCreate(newPage);

        // очистить все поля
        this.props.attributes.forEach(attribute => {
            ReactDOM.findDOMNode(this.refs[attribute]).value = '';
        });
        
        // скрыть диалог
        window.location = "#";

    }

    render(){
        let inputs = this.props.attributes.map(x=>
                <p key={x}>
                    <input type="text" placeholder={x} ref={x} className="field" />
                </p>
        );

        return <div id="addBar">
            <a href="#createElement" id="addPageLink" className="fa fa-plus"/>
            <div id="createElement" className="modalDialog">
                <div>
                    <a href="#" title="Close" className="close">X</a>
                    <h2>{this.props.title}</h2>
                    <form>
                        {inputs}
                        <button onClick={this.handleSubmit} className="submitDialogButton">Создать</button>
                    </form>
                </div>
            </div>
        </div>
    }
}

CreateDialog.propTypes ={
    title : propTypes.string,
    attributes : propTypes.array,
    onCreate : propTypes.func
};


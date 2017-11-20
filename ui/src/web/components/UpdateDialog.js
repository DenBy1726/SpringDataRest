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

        this.props.onCreate(newPage);

        // очистить все поля
        this.props.attributes.forEach(attribute => {

            ReactDOM.findDOMNode(this.refs[attribute]).className = "field";
        });
        
        // скрыть диалог
        window.location = "#";

    }

    render(){
        let inputs = this.props.attributes.map(x=>
                <p key={x}>
                    <input type="text" placeholder={x} ref={x} value={this.props.data[x]} className="field" />
                </p>
        );

        return <div id="addBar">

            <div id="updateElement" className="modalDialog">
                <div style={{textAlign:"center"}}>
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
    data : propTypes.object,
    onCreate : propTypes.func
};


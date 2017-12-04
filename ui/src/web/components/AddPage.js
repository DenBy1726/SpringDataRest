import React from "react"
import {Input,Button} from "antd"
import propTypes from "prop-types"
import { withRouter } from 'react-router-dom';
import * as ReactDOM from "react-dom";

class AddPage extends React.Component{
    constructor(props){
        super(props);

        this.onOK = this.onOK.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    onOK(){
        let obj = {};
        let that = this;
        this.props.attributes.forEach(x=>{
            obj[x] = ReactDOM.findDOMNode(that.refs[x]).value;
        });
        this.props.history.goBack();
        this.props.OK(obj);
    }

    onCancel(){
        let that = this;
        this.props.attributes.forEach(x=>{
            ReactDOM.findDOMNode(that.refs[x]).value = "";
        });
        this.props.history.goBack();
        this.props.Cancel();

    }

    render(){
        const inputs = this.props.attributes.map(x=>{
            return(
                <span >
                <label>{x}</label>
                <Input ref={x}/>
            </span>);
        });

        return (
            <div>
                <label>Title</label>
                {inputs}
                <span>
                    <Button onClick={this.onOK}>OK</Button>
                    <Button onClick={this.onCancel}>Cancel</Button>
                </span>
            </div>
        );
    }
}

AddPage.propTypes = {
    attributes: propTypes.array.isRequired,
    OK: propTypes.func.isRequired,
    Cancel: propTypes.func.isRequired
};

export default withRouter(AddPage);
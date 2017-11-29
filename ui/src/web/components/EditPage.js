import React from "react"
import {Input,Button} from "antd"
import propTypes from "prop-types"
import { withRouter } from 'react-router-dom';
import * as ReactDOM from "react-dom";

class EditPage extends React.Component{
    constructor(props){
        super(props);

        this.state = {};
        this.id = Number.parseInt(this.props.match.params.id);
        this.editing = this.props.data.filter(x=>x.id === this.id)[0];
        this.props.attributes.map(x=>this.state[x] = this.editing[x]);

        this.onOK = this.onOK.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onOK(){
        let obj = this.props.data.filter(x=>x.id === this.id)[0];
        let that = this;
        this.props.attributes.forEach(x=>{
            obj[x] = ReactDOM.findDOMNode(that.refs[x]).value;
        });
        this.props.OK(this.props.data.filter(x=>x.id === this.id)[0],obj);
        this.props.history.goBack();
    }

    onCancel(){
        let that = this;
        this.props.attributes.forEach(x=>{
            ReactDOM.findDOMNode(that.refs[x]).value = "";
        });
        this.props.Cancel();
        this.props.history.goBack();
    }

    onChange(input,value){
        this.setState({[input]:value});
    }

    render(){
        const inputs = this.props.attributes.map(x=>{
            return(
            <span >
                <label>{x}</label>
                <Input ref={x} value={this.state[x]} onChange={e=>this.onChange(x,e.target.value)}/>
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

EditPage.propTypes = {
    attributes: propTypes.array.isRequired,
    data: propTypes.array.isRequired,
    OK: propTypes.func.isRequired,
    Cancel: propTypes.func.isRequired
};

export default withRouter(EditPage);
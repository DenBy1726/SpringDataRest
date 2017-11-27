import React from "react"
import propTypes from "prop-types"
import Row from "./Row"

export default class RowCollections extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return  <tbody>
        {
            this.props.data.map(x => <Row key={x._links.self.href} data={x} delete={this.props.delete} edit={this.props.edit}/>)
        }
        </tbody>

    }
};

RowCollections.propTypes = {
    data : propTypes.object.isRequired,
    delete : propTypes.func.isRequired,
    edit : propTypes.func.isRequired
};
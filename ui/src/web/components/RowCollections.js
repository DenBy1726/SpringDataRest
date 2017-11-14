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
            this.props.data.map(x => <Row data={x}/>)
        }
        </tbody>

    }
};

RowCollections.propTypes = {
    data : propTypes.object
};
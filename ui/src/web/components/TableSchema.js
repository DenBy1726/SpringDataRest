import React from "react"
import propTypes from "prop-types"
import {loadSchema} from "../client"

export default class TableSchema extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return <thead>
            <tr>
                {this.props.data.map(x=>
                    <th>{x}</th>
                )}
            </tr>
        </thead>

    }
};

TableSchema.propTypes = {
    data : propTypes.array
};
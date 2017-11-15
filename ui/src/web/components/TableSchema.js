import React from "react"
import propTypes from "prop-types"
import {client} from "../client"

export default class TableSchema extends React.Component{
    constructor(props){
        super(props);
        this.state={header :[]}
    }

    componentDidMount() {
        client('GET','/api/v1/profile/concretePages').then(
            result => this.setState({header:result.alps.descriptors[0].descriptors.map(x=>x.name)})
        );
    }

    render(){
        return <thead>
            <tr>
                {this.state.header.map(x=>
                    <th>{x}</th>
                )}
            </tr>
        </thead>

    }
};

TableSchema.propTypes = {
    data : propTypes.array
};
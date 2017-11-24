import React from "react"
import ReactDOM from "react-dom"
import propTypes from "prop-types"

export default class TableSchema extends React.Component{
    constructor(props){
        super(props);

        this.onClick = this.onClick.bind(this);
        this.sortOrder = {};
    }

    onClick(x){

        this.props.sort(x,this.sortOrder[x] ? "desc" : "asc");
        this.sortOrder[x] = !this.sortOrder[x];

    }

    render(){
        return <thead>
            <tr>
                {this.props.data.map(x=> {
                    this.sortOrder[x] == "undefined" ? false : this.sortOrder[x];
                        return <th onClick={() => this.onClick(x)}>{x} <label>{this.sortOrder[x] ? "▲" : "▼"}</label></th>
                    }
                )}
            </tr>
        </thead>
    }
};

TableSchema.propTypes = {
    data : propTypes.array.isRequired,
    sort : propTypes.func.isRequired
};
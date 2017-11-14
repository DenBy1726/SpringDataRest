import React from "react"
import propTypes from "prop-types"

export default class Row extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return <tr>
                    <td>{this.props.data.title}</td>
                    <td>{this.props.data.category}</td>
                </tr>

    }
};

Row.propTypes = {
    data : propTypes.object
};
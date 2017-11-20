import React from "react"
import propTypes from "prop-types"

export default class Row extends React.Component{
    constructor(props){
        super(props);

        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete(){
        this.props.delete(this.props.data);
    }

    render(){
        return <tr>
                    <td>{this.props.data.title}</td>
                    <td className="rowButton">
                        {this.props.data.category}
                        <button className="delButton fa fa-times" onClick={this.handleDelete}/>
                        <a href="#updateElement" className="delButton fa fa-edit"/>
                    </td>

                </tr>

    }
};

Row.propTypes = {
    data : propTypes.object,
    delete : propTypes.func
};
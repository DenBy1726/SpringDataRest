import React from "react"

export default class Table extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return <table>
            <thead>
            <tr>
                <th>Title</th>
                <th>Category</th>
            </tr>
            </thead>
            <tbody>
            {this.props.data.map(x=><tr>
                                    <td>{x.title}</td>
                                    <td>{x.category}</td>
                                </tr>)
            }
            </tbody>
        </table>
    }
}
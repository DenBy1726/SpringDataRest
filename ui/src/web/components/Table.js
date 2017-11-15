import React from "react"
import RowCollections from "./RowCollections"
import {loadPage} from '../client'
import TableSchema from "./TableSchema";

export default class Table extends React.Component{
    constructor(props){
        super(props);
        this.state = {data : [],pageSize : 2};
    }

    componentDidMount() {
        loadPage('GET','/api/v1/concretePages',this.state.pageSize).then(
            result => this.setState({data:result._embedded.concretePages})
        );
    }

    render(){
        return <table>
                   <TableSchema/>
                   <RowCollections data={this.state.data}/>
               </table>
    }
}
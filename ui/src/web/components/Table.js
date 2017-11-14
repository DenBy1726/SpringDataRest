import React from "react"
import RowCollections from "./RowCollections"
import client from '../client'
import TableSchema from "./TableSchema";

export default class Table extends React.Component{
    constructor(props){
        super(props);
        this.state = {data : []};
    }

    componentDidMount() {
        client('GET','/api/v1/concretePages').then(response => {
            this.setState({data: response._embedded.concretePages});
        });
    }

    render(){
        return <table>
                   <TableSchema data={["Title","Category"]}/>
                   <RowCollections data={this.state.data}/>
               </table>
    }
}
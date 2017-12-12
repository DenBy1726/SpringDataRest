import React from "react"
import client from "../client"
import App from "./pages/App";
import withRouter from "react-router-dom/es/withRouter";
import {Route,Switch} from "react-router-dom";
import Redirect from "react-router-dom/es/Redirect";
import LoginPage from "./pages/Login"
import AppMenu from "./AppMenu";
import MainPage from "./pages/MainPage";


class RoleFilter extends React.Component{
    constructor(props){
        super(props);

        this.state = {role : []};
    }
    componentWillMount(){
        client({
            method: 'GET',
            path: "/auth/v1/me",
            headers: {'Content-Type': 'application/json'}
        }).then(result=>{
            this.setState({role:result.entity});
        });
    }


    render(){
        if(this.state.role.length === 0 || this.state.role === undefined)
        {
            return <div>
                <LoginPage history={this.props.history}/>
            </div>;
        }
        else {
            return <div style={{display: "flex", flexDirection: "row"}}>
                    <Route path = "/">
                        <AppMenu/>
                    </Route>
                <Switch>
                    <Route exact path="/" >
                        <MainPage/>
                    </Route>
                    <Route path="/list/">
                        <App history={this.props.history} role={this.state.role}/>
                    </Route>
                </Switch>
            </div>
        }
    }

}

export default withRouter(RoleFilter)

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

        this.state = {user : []};
    }
    componentWillMount(){
        client({
            method: 'GET',
            path: "/auth/v1/me",
            headers: {'Content-Type': 'application/json'}
        }).then(result=>{
                this.setState({user:result.entity});
        });
    }


    render() {
        if (this.state.user.role === undefined || this.state.user.role.length === 0 ) {
            return <LoginPage history={this.props.history}/>
        }
        let isAnonim = this.state.user.role.findIndex(x => x.name === "ANONIM");
        let isModer = this.state.user.role.findIndex(x => x.name === "MODER");
        let isUser = this.state.user.role.findIndex(x => x.name === "USER");
        if(isAnonim !== -1)
            return <LoginPage history={this.props.history}/>
        let appMenu = isModer !== -1 ?
            <Route path="/">
                <AppMenu/>
            </Route> :
            null;
        let app = isModer !== -1 ?
            <Route path="/list">
                <App history={this.props.history} role={this.state.role}/>
            </Route>:
            <Redirect to={"/"}/>;
        let main = isUser !== -1 ?
            <Route exact path="/">
                <MainPage/>
            </Route> :
            null;
        return <div style={{display: "flex", flexDirection: "row"}}>
            {appMenu}
            <Switch>
                {main}
                {app}
            </Switch>
        </div>
    }

}

export default withRouter(RoleFilter)

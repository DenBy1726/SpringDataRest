import React from "react"
import client from "../client"
import App from "./pages/App";
import withRouter from "react-router-dom/es/withRouter";
import {Route,Switch} from "react-router-dom";
import Redirect from "react-router-dom/es/Redirect";
import LoginPage from "./pages/Login"
import AppMenu from "./AppMenu";
import MainPage from "./pages/MainPage";
import Spin from "antd/es/spin/index";
import WrappedRegistrationForm from "./pages/RegistrationForm"

class RoleFilter extends React.Component{
    constructor(props){
        super(props);

        this.state = {user : []};
        this.loading = {};
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        console.log("catched")
        // You can also log the error to an error reporting service;
    }

    componentWillMount(){
        this.loading = true;

        client({
            method: 'GET',
            path: "/auth/v1/me",
            headers: {'Content-Type': 'application/json', 'X-Requested-With' : ''},
        }).then(result=>{
                this.loading = false;
                this.setState({user:result.entity});
        });
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
    }




    render() {
        let content;
        if(this.loading === true){
            return  <Spin loading={this.loading}/>
        }
        else {
            let isAnonim = this.state.user.role.findIndex(x => x.name === "ANONIM");
            let isModer = this.state.user.role.findIndex(x => x.name === "MODER");
            let isUser = this.state.user.role.findIndex(x => x.name === "USER");

            if(isAnonim !== -1 && this.props.location.pathname !== "/login")
                this.props.history.push("/login");

            let appMenu = isModer !== -1 ?
                <Route path="/">
                    <AppMenu/>
                </Route> :
                null;
            let app = isModer !== -1 ?
                <Route path="/list">
                    <App history={this.props.history} role={this.state.role}/>
                </Route> :
                null;
            let main = isUser !== -1 ?
                <Route exact path="/">
                    <MainPage user={this.state.user}/>
                </Route> :
                null;
            return <div>
                        <Route path="/login">
                            <LoginPage history={this.props.history}/>
                        </Route>
                        <Route path="/registration">
                            <WrappedRegistrationForm/>
                        </Route>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            {appMenu}
                            <div style={{flexGrow: "1"}}>
                                <Switch>
                                    {main}
                                    {app}
                                </Switch>
                            </div>
                        </div>
                </div>
        }

    }

}

export default withRouter(RoleFilter)

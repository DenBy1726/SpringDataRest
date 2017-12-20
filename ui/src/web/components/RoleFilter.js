import React from "react"
import actions from "../actions/role/action"
import App from "./pages/App";
import withRouter from "react-router-dom/es/withRouter";
import {Route,Switch} from "react-router-dom";
import Redirect from "react-router-dom/es/Redirect";
import LoginPage from "./pages/Login"
import AppMenu from "./AppMenu";
import MainPage from "./pages/MainPage";
import Spin from "antd/es/spin/index";
import WrappedRegistrationForm from "./pages/RegistrationForm"
import {connect} from "react-redux";
import {createBrowserHistory} from 'history';

class RoleFilter extends React.Component{
    constructor(props){
        super(props);
    }

    componentWillMount(){
        this.props.request();
    }

    render() {
        if(this.props.fetching === false){
            return  <Spin loading={this.loading}/>
        }
        else {
            let isAnonim = this.props.user.role.findIndex(x => x.name === "ANONIM");
            let isModer = this.props.user.role.findIndex(x => x.name === "MODER");
            let isUser = this.props.user.role.findIndex(x => x.name === "USER");

            if(isAnonim !== -1 && this.props.location.pathname !== "/login")
                this.props.history.push("/login");

            let appMenu = isModer !== -1 ?
                <Route path="/">
                    <AppMenu/>
                </Route> :
                null;
            let app = isModer !== -1 ?
                <Route path="/list">
                    <App history={this.props.history} role={this.props.user}/>
                </Route> :
                null;
            let main = isUser !== -1 ?
                <Route exact path="/">
                    <MainPage user={this.props.user}/>
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


function mapStateToProps(state) {
   // console.log(state);
    return {
        //пользователь
        user: state.role.user,
        fetching: state.role.fetching
    };
}

//связываем действия и состояние с видом
export default withRouter(connect(mapStateToProps, actions)(RoleFilter));

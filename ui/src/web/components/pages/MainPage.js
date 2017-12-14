import React from "react"
import Link from "react-router-dom/es/Link";
import Button from "antd/es/button/button";
import propTypes from "prop-types"
import Redirect from "react-router-dom/es/Redirect";
import NavLink from "react-router-dom/es/NavLink";
import withRouter from "react-router-dom/es/withRouter";
import Input from "antd/es/input/Input";

class MainPage extends React.Component{
    render(){
        return<div className={"main"}>
            <h1>Hello, {this.props.user.name + " " + this.props.user.lastName}</h1>
            <form action="/auth/v1/logout" method="post">
                <Input class="btn btn-danger center-block" type="submit" value="Logout" id={"logout"}/>
            </form>
        </div>
    }
}

MainPage.propTypes = {
    user : propTypes.object
};

export default withRouter(MainPage);
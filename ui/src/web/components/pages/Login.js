import React from "react"
import {Form, Input} from "antd";
import Icon from "antd/es/icon/index";
import Checkbox from "antd/es/checkbox/Checkbox";
import Button from "antd/es/button/button";
import withRouter from "react-router-dom/es/withRouter";
import client from "../../api/client"
import Link from "react-router-dom/es/Link";
const FormItem = Form.Item;
class LoginForm extends React.Component{

    constructor(props){
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                client({
                    method: 'POST',
                    path: "/auth/v1/login",
                    entity: values,
                    headers: {'Content-Type': 'application/json'}
                })
            }
        });
    }


    render(){
   //     const { getFieldDecorator } = this.props.form;
        return (
            <div style={{display:"flex",alignItems: "center",justifyContent: "center"}}>
                <form name='loginForm'
                      action="/auth/v1/login" method='POST' className={"login-form"} >
                            <label>User:</label>
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                   placeholder="Login" type='text' name='username' />
                            <br/>
                            <label>Password:</label>
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                   placeholder="Password" type='password' name='password' />
                            <br/>
                            <Checkbox name={"remember-me-parameter"}>Remember me</Checkbox>
                            <br/>
                            <Button type="primary" htmlType="submit">Log In</Button>
                            <Button type="primary">
                                <Link to={"registration"}>Register</Link>
                            </Button>
                </form>
            </div>

        );
    }
}

//const LoginPage = Form.create()(LoginForm); remember-me-parameter
export default withRouter(LoginForm);

/*<Form onSubmit={this.handleSubmit} className="login-form">
    <FormItem>
        {getFieldDecorator('username', {
            rules: [
                { type: 'string',pattern:"[a-zA-Z0-9]{4,20}", message: 'Неверный формат!'},
                { required: true, message: 'Please input your username!' }],
        })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
        )}
    </FormItem>
    <FormItem>
        {getFieldDecorator('password', {
            rules: [
                { type: 'string',pattern:"[a-zA-Z0-9]{4,20}", message: 'Неверный формат!'},
                { required: true, message: 'Please input your Password!' }],
        })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
        )}
    </FormItem>
    <FormItem>
        {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
        })(
            <Checkbox>Remember me</Checkbox>
        )}
        <a className="login-form-forgot" href="">Forgot password</a>
        <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
        </Button>
        Or <a href="">register now!</a>
    </FormItem>
</Form>*/



/*
* <Form method="POST" action={"/api/v1/login"} className="form-signin">
            <h2 className="form-heading">Log in</h2>
            <div className="form-group">
                <input name="username" type="text" className="form-control" placeholder="Username"
                       autoFocus="true"/>
                <input name="password" type="password" className="form-control" placeholder="Password"/>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" id="remember_me" name="remember-me-parameter"/>
                    </label>
                </div>
                <button className="btn btn-lg btn-primary btn-block" type="submit">Войти</button>
            </div>
        </Form>
        */
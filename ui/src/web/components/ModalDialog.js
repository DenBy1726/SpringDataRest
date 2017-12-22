import { Button, Modal, Form, Input, Radio } from 'antd';
import React from "react"
import Icon from "antd/es/icon/index";
import Checkbox from "antd/es/checkbox/Checkbox";
import request from "../api/request";
const FormItem = Form.Item;

class ExpiredDialog extends React.Component{
    constructor(props){
        super(props);

        this.submit = this.submit.bind(this);
    }

    submit(e){
        e.preventDefault();
        this.props.history.goBack();
    }
        handleSubmit(e){
            let that = this;
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    fetch("/auth/v1/login", {
                        method: 'POST',
                        body: "username=" + values.username + "&" + "password=" + values.password,
                        credentials: 'include',
                        headers: {"Content-Type": "application/x-www-form-urlencoded"}
                    }).then(response => {
                        that.setState({visible: false});
                        that.props.onCancel();
                    });
                }});
        }

    render(){
        const { visible, onCreate, form,history } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title="Ваша сессия закончилась"
                okText="Продлить"
                cancelText="Выйти"
                onCancel={()=>history.go("/login")}
                onOk={(e)=>this.handleSubmit(e)}
            >
                <Form layout="vertical">
                        <FormItem label="Логин:">
                            {getFieldDecorator('username')(
                            < Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />}
                                placeholder="Login" type='text' name='username' />
                                )}
                        </FormItem>
                        <FormItem label="Пароль:">
                            {getFieldDecorator('password')(
                            < Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
                                placeholder="Password" type='password' name='password' />
                            )}
                        </FormItem>
                        <FormItem>
                                <Checkbox name={"remember-me-parameter"}>Запомнить меня</Checkbox>
                        </FormItem>
                </Form>
            </Modal>
        );
    }
}

const ModalDialog = Form.create()(ExpiredDialog);
export default ModalDialog;


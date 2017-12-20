import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
import React from "react"
import DatePicker from "antd/es/date-picker/index";
import client from "../../api/client"
import withRouter from "react-router-dom/es/withRouter";

class RegistrationForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
        this.checkConfirm = this.checkConfirm.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
    }

    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.user = {
                    name:values.name,
                    lastName:values.lastName,
                    birthday:values.birthday,
                    registerOn: new Date()
                };
                delete(values.name);
                delete(values.lastName);
                delete(values.birthday);
                client({
                    method: 'POST',
                    path: "/auth/v1/registration",
                    entity: values,
                    headers: {'Content-Type': 'application/json'}
                }).then(result=>{
                    let x = "213";
                    if(result.entity === true)
                        this.props.history.go("/");
                })
            }
        });
    };
    handleConfirmBlur(e){
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    checkPassword(rule, value, callback){
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };
    checkConfirm(rule, value, callback){
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };


    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="Логин"
                >
                    {getFieldDecorator('login', {
                        rules: [{
                            type: 'string',pattern: "[a-zA-Z0-9]{6,20}", message: 'Login must be from 6 to 20 and only latin sybmol and number',
                        }, {
                            required: true, message: 'Please input your login!',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Пароль"
                >
                    {getFieldDecorator('password', {
                        rules: [{
                                type: 'string',pattern: "[a-zA-Z0-9]{6,20}", message: 'Password must be from 6 to 20 and only latin sybmol and number',
                            },
                            {
                            required: true, message: 'Please input your password!',
                        }, {
                            validator: this.checkConfirm,
                        }],
                    })(
                        <Input type="password" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Повторите пароль"
                >
                    {getFieldDecorator('passwordAgain', {
                        rules: [{
                            required: true, message: 'Please confirm your password!',
                        }, {
                            validator: this.checkPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur} />
                    )}
                </FormItem>
                <FormItem{...formItemLayout} label="Имя">
                    {getFieldDecorator('name', {
                        rules: [{
                            type: 'string', message: 'Неверный формат!',
                        }, {
                            required: true, message: 'Введите имя',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem{...formItemLayout} label="Фамилия">
                    {getFieldDecorator('lastName', {
                        rules: [{
                            type: 'string', message: 'Неверный формат!',
                        }, {
                            required: true, message: 'Введите фамилию ',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem{...formItemLayout} label="Дата рождения">
                    {getFieldDecorator('birthday', {
                        rules: [{
                            type: 'object', message: 'Неверный формат!',
                        }, {
                            required: true, message: 'Введите дату ',
                        }],
                    })(
                        <DatePicker />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" onClick={()=>this.props.history.goBack()}>Go Back</Button>
                    <Button type="primary" htmlType="submit">Register</Button>
                </FormItem>
            </Form>
        );
    }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);
export default withRouter(WrappedRegistrationForm);
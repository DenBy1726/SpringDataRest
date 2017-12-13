import React from "react"
import {Input,Button} from "antd"
import propTypes from "prop-types"
import { withRouter } from 'react-router-dom';
import * as ReactDOM from "react-dom";
import Form from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import DatePicker from "antd/es/date-picker/index";
import moment from 'moment'

class AddForm extends React.Component{
    constructor(props){
        super(props);

        this.onCancel = this.onCancel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    onCancel(){
        this.props.Cancel();
        this.props.history.goBack();
    }


    handleSubmit(e){
        e.preventDefault();

        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            // Should format date value before submit.
            let values = {
                name: fieldsValue['Name'],
                lastName: fieldsValue['Last name'],
                birthday: fieldsValue['Birthday'].format('YYYY-MM-DD'),
                register_on: new Date().toISOString().split('T')[0]
            };
            this.props.OK(values);
            this.props.history.goBack();
        });
    }

    render(){

        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            }
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
            <Form onSubmit={this.handleSubmit} >
                <FormItem{...formItemLayout} label="Имя">
                    {getFieldDecorator('Name', {
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
                    {getFieldDecorator('Last name', {
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
                    {getFieldDecorator('Birthday', {
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
                    <Button type="primary" htmlType="submit">Применить</Button>
                    <Button type="primary" onClick={this.onCancel}>Отмена</Button>
                </FormItem>
            </Form>
        );
    }
}

AddForm.propTypes = {
    data: propTypes.array.isRequired,
    OK: propTypes.func.isRequired,
    Cancel: propTypes.func.isRequired
};

const AddPage = Form.create()(AddForm);

export default withRouter(AddPage);
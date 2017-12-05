import React from "react"
import {Input,Button} from "antd"
import propTypes from "prop-types"
import { withRouter } from 'react-router-dom';
import * as ReactDOM from "react-dom";
import Form from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import DatePicker from "antd/es/date-picker/index";
import moment from 'moment'

class EditForm extends React.Component{
    constructor(props){
        super(props);

        this.id = Number.parseInt(this.props.match.params.id);
        this.editing = this.props.data.filter(x=>x.id === this.id)[0];

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
                id: this.editing.id
            };
            values.age = new Date().getYear() - new Date(values.birthday).getYear();
            this.props.OK(this.editing,values);
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
                        initialValue: this.editing.name,
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
                        initialValue: this.editing.lastName,
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
                        initialValue: moment(this.editing.birthday,"YYYY-MM-DD"),
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

EditForm.propTypes = {
    data: propTypes.array.isRequired,
    OK: propTypes.func.isRequired,
    Cancel: propTypes.func.isRequired
};

const EditPage = Form.create()(EditForm);

export default withRouter(EditPage);
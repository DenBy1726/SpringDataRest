import React from "react"
import { Menu, Icon } from 'antd';
import NavLink from "react-router-dom/es/NavLink";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class AppMenu extends React.Component {
    render(){
        return (
            <Menu mode="inline" style={{width:200}}>
                <Menu.Item key="main">
                    Профиль
                    <NavLink to="/"/>
                </Menu.Item>

                <Menu.SubMenu title="Страницы" key="pages">
                    <Menu.Item key="show">
                        Список
                        <NavLink to="/list/"/>
                    </Menu.Item>
                    <Menu.Item key="add">
                        Добавить
                        <NavLink to="/list/Add/"/>
                    </Menu.Item>
                </Menu.SubMenu>
            </Menu>
        );

    }
}


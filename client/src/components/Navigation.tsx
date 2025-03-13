import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { 
  HomeOutlined, 
  SwapOutlined, 
  BankOutlined,
  SettingOutlined
} from '@ant-design/icons';

export default function Navigation() {
  const location = useLocation();

  return (
    <Menu 
      mode="horizontal" 
      selectedKeys={[location.pathname]}
      className="app-navigation"
    >
      <Menu.Item key="/" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="/swap" icon={<SwapOutlined />}>
        <Link to="/swap">Swap</Link>
      </Menu.Item>
      <Menu.Item key="/tokens" icon={<BankOutlined />}>
        <Link to="/tokens">Tokens</Link>
      </Menu.Item>
      <Menu.Item key="/admin" icon={<SettingOutlined />}>
        <Link to="/admin">Admin</Link>
      </Menu.Item>
    </Menu>
  );
}
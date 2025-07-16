import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import NotificationPanel from './NotificationPanel';
import AppFooter from './AppFooter';

const { Header, Content } = Layout;
const { Title } = Typography;

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  let userRole;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role;
    } catch (e) {
      console.error("Invalid token");
      // Handle invalid token, maybe logout user
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getDashboardPath = () => {
    switch (userRole) {
      case 'admin':
        return '/admin';
      case 'doctor':
        return '/doctor';
      default:
        return '/user';
    }
  };

  const getMenuItems = () => {
    const items = [
      {
        key: '/find-doctor',
        label: <Link to="/find-doctor">Find a Doctor</Link>,
      },
    ];

    if (token) {
      if (userRole === 'doctor') {
        items.push({
          key: '/doctor/profile',
          label: <Link to="/doctor/profile">My Profile</Link>,
        });
      }
      items.push(
        {
          key: 'notifications',
          label: <NotificationPanel />,
        },
        {
          key: getDashboardPath(),
          label: <Link to={getDashboardPath()}>My Dashboard</Link>,
        },
        {
          key: 'logout',
          label: <a onClick={handleLogout}>Logout</a>,
        }
      );
    } else {
      items.push(
        {
          key: '/login',
          label: <Link to="/login">Login</Link>,
        },
        {
          key: '/register',
          label: <Link to="/register">Register</Link>,
        }
      );
    }

    return items;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/">
          <Title level={4} style={{ color: 'white', margin: 0 }}>Doctor Appointment</Title>
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ flex: 1, justifyContent: 'flex-end' }}
          items={getMenuItems()}
        />
      </Header>
      <Content style={{ padding: '20px 50px' }}>
        {children}
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default AppLayout; 
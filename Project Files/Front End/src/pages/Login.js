import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Alert } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, HomeOutlined, SmileOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthBackground from '../components/AuthBackground'; // Keep this minimal without bubbles

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showApprovalMsg, setShowApprovalMsg] = useState(
    new URLSearchParams(useLocation().search).get('status') === 'pending_approval'
  );
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', values);
      localStorage.setItem('token', res.data.token);
      message.success('Welcome back!');
      const { role } = res.data;
      navigate(role === 'admin' ? '/admin' : role === 'doctor' ? '/doctor' : '/user');
    } catch (err) {
      message.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthBackground>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
      }}>
        <Card
          style={{
            width: 340,
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            border: 'none',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <SmileOutlined style={{ fontSize: 40, color: '#1677ff', marginBottom: 8 }} />
            <Title level={4} style={{ marginBottom: 4 }}>Welcome Back</Title>
            <Text type="secondary">Login to your account</Text>
          </div>

          {showApprovalMsg && (
            <Alert
              type="info"
              showIcon
              message="Pending Approval"
              description="Your account is awaiting admin approval."
              style={{ marginBottom: 16 }}
              closable
              onClose={() => setShowApprovalMsg(false)}
            />
          )}

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
              <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              icon={<LoginOutlined />}
              style={{ borderRadius: 6 }}
            >
              Login
            </Button>
          </Form>

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Text type="secondary">Don't have an account? </Text>
            <a href="/register">Register</a>
          </div>

          <Button
            type="text"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
            block
            style={{ marginTop: 12, color: '#1677ff' }}
          >
            Back to Home
          </Button>
        </Card>
      </div>
    </AuthBackground>
  );
};

export default Login;

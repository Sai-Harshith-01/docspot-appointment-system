import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Select, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, HomeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', values);
      message.success(
        values.role === 'doctor'
          ? 'Registered successfully! Waiting for admin approval.'
          : 'Registered successfully! Please log in.'
      );
      navigate(`/login${values.role === 'doctor' ? '?status=pending_approval' : ''}`);
    } catch (err) {
      const msg = err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Registration failed';
      message.error(msg);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', padding: '24px' }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        }}
      >
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Create Account</Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" rules={[{ required: true, message: 'Enter your name' }]}>
            <Input size="large" placeholder="Name" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item name="email" rules={[{ required: true, message: 'Enter your email' }]}>
            <Input size="large" placeholder="Email" prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Enter your password' }]}>
            <Input.Password size="large" placeholder="Password" prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject('Passwords do not match!');
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="Confirm Password" prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item name="role" rules={[{ required: true, message: 'Select your role' }]}>
            <Select size="large" placeholder="I am a...">
              <Option value="user">Patient</Option>
              <Option value="doctor">Doctor</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              size="large"
              style={{ borderRadius: 8 }}
            >
              Register
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text>Already have an account? </Text>
          <a href="/login">Login</a>
        </div>

        <Button
          type="text"
          icon={<HomeOutlined />}
          block
          style={{ marginTop: 24 }}
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Card>
    </div>
  );
}

export default Register;

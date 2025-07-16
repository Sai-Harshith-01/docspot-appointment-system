import React, { useState, useEffect } from 'react';
import { Form, Input, Button, InputNumber, Progress, message } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import axios from 'axios';

const checklist = [
  { label: 'Specialty', key: 'specialty' },
  { label: 'Qualifications', key: 'qualifications' },
  { label: 'Experience', key: 'experience' },
];

const getChecklistStatus = (values) => ({
  specialty: !!values.specialty,
  qualifications: !!values.qualifications,
  experience: !!values.experience,
});

const CompleteProfile = () => {
  const [form] = Form.useForm();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkStatus, setCheckStatus] = useState(getChecklistStatus({}));

  // Calculate progress based on filled fields
  const updateProgress = (values) => {
    let filled = 0;
    if (values.specialty) filled++;
    if (values.qualifications) filled++;
    if (values.experience) filled++;
    setProgress((filled / 3) * 100);
  };

  useEffect(() => {
    form.validateFields().then(values => {
      updateProgress(values);
      setCheckStatus(getChecklistStatus(values));
    }).catch(() => {});
  }, [form]);

  const onValuesChange = (changed, all) => {
    updateProgress(all);
    setCheckStatus(getChecklistStatus(all));
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/doctors/profile', values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Profile completed! Redirecting to dashboard...');
      setTimeout(() => {
        window.location.href = '/doctor/dashboard';
      }, 1500);
    } catch (err) {
      message.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 0'
    }}>
      <div style={{
        maxWidth: 520,
        width: '100%',
        margin: '0 auto',
        padding: 40,
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 8px 32px rgba(80, 120, 200, 0.10)',
        border: '1px solid #e0e7ff'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, fontSize: 28, color: '#2563eb', fontWeight: 700, letterSpacing: 1 }}>Complete Your Profile</h2>
        <Progress percent={progress} showInfo={false} style={{ marginBottom: 24 }} strokeColor="#10b981" />
        <ul style={{
          listStyle: 'none',
          padding: 16,
          marginBottom: 24,
          background: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}>
          {checklist.map(item => (
            <li key={item.key} style={{ display: 'flex', alignItems: 'center', fontSize: 17, fontWeight: 500 }}>
              {checkStatus[item.key] ? (
                <CheckCircleTwoTone twoToneColor="#52c41a" style={{ marginRight: 10, fontSize: 22 }} />
              ) : (
                <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ marginRight: 10, fontSize: 22 }} />
              )}
              {item.label}
            </li>
          ))}
        </ul>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={onValuesChange}
          requiredMark
        >
          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 16 }}>Specialty</span>}
            name="specialty"
            rules={[{ required: true, message: 'Please enter your specialty' }]}
          >
            <Input placeholder="e.g. Cardiologist" size="large" />
          </Form.Item>
          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 16 }}>Qualifications (comma separated)</span>}
            name="qualifications"
            rules={[{ required: true, message: 'Please enter your qualifications' }]}
          >
            <Input placeholder="e.g. MBBS, MD" size="large" />
          </Form.Item>
          <Form.Item
            label={<span style={{ fontWeight: 600, fontSize: 16 }}>Experience (years)</span>}
            name="experience"
            rules={[{ required: true, type: 'number', min: 1, message: 'Please enter your experience in years' }]}
          >
            <InputNumber min={1} max={60} style={{ width: '100%' }} size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} disabled={progress < 100} size="large" style={{ borderRadius: 8, background: '#10b981', borderColor: '#10b981', fontWeight: 600, fontSize: 17 }}>
              Complete Profile
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CompleteProfile; 
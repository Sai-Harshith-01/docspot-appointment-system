import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Form, Input, Button, Card, Typography, message, Spin, Alert, InputNumber, TimePicker, List, Tag, Avatar, Divider, Empty, Upload, Row, Col, Statistic, Progress, Tabs } from 'antd';
import { UserOutlined, FileTextOutlined, SmileOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import ProfileCompletionAlert from '../components/ProfileCompletionAlert';

const { Title, Paragraph } = Typography;
const { RangePicker } = TimePicker;
const { TabPane } = Tabs;

function DoctorDashboard() {
  const [form] = Form.useForm();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [profile, setProfile] = useState({});
  const [activeTab, setActiveTab] = useState('all');

  const token = localStorage.getItem('token');
  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  const fetchDoctorAppointments = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/appointments/doctor-appointments', config);
      setAppointments(data);
    } catch (err) {
      console.error("Could not fetch appointments");
    }
  }, [config]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [appointmentsRes, profileRes] = await Promise.all([
          axios.get('http://localhost:5000/api/appointments/doctor-appointments', config),
          axios.get('http://localhost:5000/api/doctors/profile', config)
        ]);
        setAppointments(appointmentsRes.data);
        setProfile(profileRes.data);
        // Antd's TimePicker requires moment objects
        const hours = profileRes.data.consultationHours?.start && profileRes.data.consultationHours?.end
          ? [moment(profileRes.data.consultationHours.start, 'HH:mm'), moment(profileRes.data.consultationHours.end, 'HH:mm')]
          : undefined;
        form.setFieldsValue({
          ...profileRes.data,
          qualifications: profileRes.data.qualifications.join(', '),
          consultationHours: hours,
        });
        setError(null);
      } catch (err) {
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || 'Failed to fetch profile.');
        }
      }
      setLoading(false);
    };
    fetchDashboardData();
    fetchDoctorAppointments();
  }, [form, fetchDoctorAppointments, config]);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await axios.get('/api/doctors/me', { headers: { Authorization: `Bearer ${token}` } });
        const profile = res.data;
        if (
          !profile.specialty ||
          profile.specialty === 'Not set' ||
          !profile.qualifications ||
          (Array.isArray(profile.qualifications) && profile.qualifications[0] === 'Not set') ||
          !profile.experience ||
          profile.experience <= 0
        ) {
          setProfileIncomplete(true);
        } else {
          setProfileIncomplete(false);
        }
      } catch (err) {}
    };
    checkProfile();
  }, [navigate]);

  // Profile completion calculation
  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    let completed = 0;
    if (profile.specialty && profile.specialty !== 'Not set') completed++;
    if (profile.qualifications && Array.isArray(profile.qualifications) && profile.qualifications[0] !== 'Not set') completed++;
    if (profile.experience && profile.experience > 0) completed++;
    if (profile.consultationHours && profile.consultationHours.start && profile.consultationHours.end) completed++;
    if (profile.profileImageUrl) completed++;
    return Math.round((completed / 5) * 100);
  }, [profile]);

  const onFinish = async (values) => {
    setSubmitting(true);
    setError(null);
    const formData = new FormData();
    formData.append('specialty', values.specialty);
    formData.append('qualifications', values.qualifications);
    formData.append('experience', values.experience);
    formData.append('consultationHours', JSON.stringify({
      start: values.consultationHours[0].format('HH:mm'),
      end: values.consultationHours[1].format('HH:mm'),
    }));
    if (values.profileImage && values.profileImage[0]) {
      formData.append('profileImage', values.profileImage[0].originFileObj);
    }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put('http://localhost:5000/api/doctors/profile', formData, {
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Profile updated successfully!');
      window.dispatchEvent(new Event('doctor-profile-updated'));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
    setSubmitting(false);
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:5000/api/appointments/${appointmentId}/status`, { status: newStatus }, config);
      message.success(`Appointment status updated to ${newStatus}`);
      fetchDoctorAppointments();
    } catch (err) {
      message.error('Failed to update status.');
    }
  };

  // Appointment filters
  const filteredAppointments = useMemo(() => {
    if (activeTab === 'all') return appointments;
    if (activeTab === 'upcoming') return appointments.filter(a => a.status === 'Pending' || a.status === 'Confirmed');
    if (activeTab === 'completed') return appointments.filter(a => a.status === 'Completed');
    if (activeTab === 'cancelled') return appointments.filter(a => a.status === 'Cancelled');
    return appointments;
  }, [appointments, activeTab]);

  // Stats
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'Completed').length;
  const pendingAppointments = appointments.filter(a => a.status === 'Pending' || a.status === 'Confirmed').length;
  const cancelledAppointments = appointments.filter(a => a.status === 'Cancelled').length;

  if (loading) {
    return <Spin tip="Loading Profile..." style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
        padding: '48px 0 32px 0',
        textAlign: 'center',
        color: 'white',
        marginBottom: 32,
        boxShadow: '0 4px 24px rgba(59,130,246,0.08)'
      }}>
        <Avatar size={80} src={profile.profileImageUrl ? (profile.profileImageUrl.startsWith('http') ? profile.profileImageUrl : `http://localhost:5000${profile.profileImageUrl}`) : null} icon={<UserOutlined />} style={{ background: '#fff', color: '#3b82f6', marginBottom: 16 }} />
        <Title level={2} style={{ color: 'white', marginBottom: 0 }}>{profile.user?.name || 'Doctor'}</Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, marginBottom: 0 }}>
          Welcome to your dashboard. Manage your appointments and profile with ease.
        </Paragraph>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
        {/* Summary Bar */}
        <Row gutter={24} style={{ marginBottom: 32 }} justify="center">
          <Col xs={12} sm={6}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(59,130,246,0.07)' }}>
              <Statistic title="Total Appointments" value={totalAppointments} prefix={<CalendarOutlined />} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(59,130,246,0.07)' }}>
              <Statistic title="Upcoming" value={pendingAppointments} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#3b82f6' }} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(59,130,246,0.07)' }}>
              <Statistic title="Completed" value={completedAppointments} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#10b981' }} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(59,130,246,0.07)' }}>
              <Statistic title="Cancelled" value={cancelledAppointments} prefix={<CloseCircleOutlined />} valueStyle={{ color: '#ef4444' }} />
            </Card>
          </Col>
        </Row>

        <Row gutter={32}>
          {/* Appointments Section */}
          <Col xs={24} md={14}>
            <Card style={{ borderRadius: 18, boxShadow: '0 4px 24px rgba(59,130,246,0.08)', marginBottom: 32 }}>
              <Title level={4} style={{ color: '#3b82f6', marginBottom: 0 }}><CalendarOutlined /> Appointments</Title>
              <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginTop: 16 }}>
                <TabPane tab={<span>All</span>} key="all" />
                <TabPane tab={<span>Upcoming</span>} key="upcoming" />
                <TabPane tab={<span>Completed</span>} key="completed" />
                <TabPane tab={<span>Cancelled</span>} key="cancelled" />
              </Tabs>
              <Divider style={{ margin: '8px 0 16px 0' }} />
              {filteredAppointments.length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={filteredAppointments}
                  renderItem={item => (
                    <List.Item
                      style={{ background: '#e0f2fe', borderRadius: 8, marginBottom: 8 }}
                      actions={[
                        item.status === 'Pending' && <Button size="small" type="primary" style={{ background: '#3b82f6', borderColor: '#3b82f6', borderRadius: 8 }} onClick={() => handleStatusUpdate(item._id, 'Confirmed')}>Confirm</Button>,
                        item.status !== 'Cancelled' && <Button size="small" danger style={{ borderRadius: 8 }} onClick={() => handleStatusUpdate(item._id, 'Cancelled')}>Cancel</Button>,
                        item.status === 'Confirmed' && <Button size="small" style={{ borderRadius: 8 }} onClick={() => handleStatusUpdate(item._id, 'Completed')}>Complete</Button>,
                      ].filter(Boolean)}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={item.user?.profileImageUrl} style={{ backgroundColor: '#10b981' }} icon={!item.user?.profileImageUrl && <UserOutlined />} />}
                        title={<span style={{ color: '#2563eb' }}>Appointment with {item.user.name}</span>}
                        description={
                          <>
                            <div>Date: <b>{new Date(item.date).toLocaleString()}</b></div>
                            <Tag color={item.status === 'Completed' ? 'green' : item.status === 'Cancelled' ? 'red' : 'blue'} style={{ marginTop: 4 }}>{item.status}</Tag>
                            {item.documents && item.documents.length > 0 && (
                              <div style={{ marginTop: 4 }}>
                                Documents: {item.documents.map((doc, idx) => (
                                  <a key={idx} href={`http://localhost:5000${doc}`} target="_blank" rel="noopener noreferrer" style={{ marginRight: 8 }}>
                                    <FileTextOutlined /> File {idx + 1}
                                  </a>
                                ))}
                              </div>
                            )}
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description={<span>No appointments.<br />Appointments you receive will appear here.</span>} imageStyle={{ height: 60 }} style={{ margin: '32px 0' }} />
              )}
            </Card>
          </Col>

          {/* Profile Management Section */}
          <Col xs={24} md={10}>
            <Card style={{ borderRadius: 18, boxShadow: '0 4px 24px rgba(16,185,129,0.08)', marginBottom: 32 }}>
              <Title level={4} style={{ color: '#10b981', marginBottom: 0 }}><EditOutlined /> Manage Your Profile</Title>
              <Divider style={{ borderColor: '#10b981', margin: '8px 0 16px 0' }} />
              <div style={{ marginBottom: 16 }}>
                <Progress percent={profileCompletion} status={profileCompletion === 100 ? 'success' : 'active'} strokeColor={profileCompletion === 100 ? '#10b981' : '#3b82f6'} />
                <div style={{ fontSize: 14, color: profileCompletion === 100 ? '#10b981' : '#3b82f6', marginTop: 4 }}>
                  {profileCompletion === 100 ? 'Profile Complete!' : 'Complete your profile for better visibility.'}
                </div>
              </div>
              {profileIncomplete && <ProfileCompletionAlert />}
              {error && <Alert message={error} type="error" showIcon closable onClose={() => setError(null)} style={{ marginBottom: 20 }} />}
              <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 8 }}>
                <Form.Item label="Specialty" name="specialty" rules={[{ required: true, message: 'Please enter your specialty!' }]} extra="Please enter your specialty!"> <Input /> </Form.Item>
                <Form.Item label="Qualifications (comma-separated)" name="qualifications" rules={[{ required: true, message: 'Please enter your qualifications!' }]} extra="Please enter your qualifications!"> <Input /> </Form.Item>
                <Form.Item label="Years of Experience" name="experience" rules={[{ required: true, message: 'Please enter your years of experience!' }]} extra="Please enter your years of experience!"> <InputNumber min={0} style={{ width: '100%' }} /> </Form.Item>
                <Form.Item label="Consultation Hours" name="consultationHours" rules={[{ required: true, message: 'Please select your consultation hours!' }]} extra="Please select your consultation hours!"> <RangePicker format="HH:mm" /> </Form.Item>
                <Form.Item label="Profile Image" name="profileImage" valuePropName="fileList" getValueFromEvent={(e) => e && e.fileList}>
                  <Upload name="profileImage" listType="picture" beforeUpload={() => false} maxCount={1}>
                    <Button icon={<UserOutlined />}>Click to upload</Button>
                  </Upload>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block loading={submitting} style={{ borderRadius: 8, background: '#10b981', borderColor: '#10b981' }}>
                    Update Profile
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default DoctorDashboard; 
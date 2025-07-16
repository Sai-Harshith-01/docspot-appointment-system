import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Button, message, Spin, Alert, Tabs, Table, Tag, Modal, Card, Row, Col, Statistic, Avatar } from 'antd';
import { ExclamationCircleOutlined, UserOutlined, TeamOutlined, SolutionOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { confirm } = Modal;

function AdminDashboard() {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [unapproved, users, doctors, appointments] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/unapproved-doctors', config),
        axios.get('http://localhost:5000/api/admin/users', config),
        axios.get('http://localhost:5000/api/admin/doctors', config),
        axios.get('http://localhost:5000/api/admin/appointments', config),
      ]);
      setPendingDoctors(unapproved.data);
      setUsers(users.data);
      setDoctors(doctors.data);
      setAppointments(appointments.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching admin data.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/approve-doctor/${id}`, {}, config);
      message.success('Doctor approved successfully!');
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to approve doctor.');
    }
  };

  const showApproveConfirm = (id) => {
    confirm({
      title: 'Are you sure you want to approve this doctor?',
      icon: <ExclamationCircleOutlined />,
      content: 'This will allow the doctor to be listed and bookable.',
      onOk() {
        return handleApprove(id);
      },
      onCancel() {},
    });
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Are you sure you want to delete this doctor?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      onOk() {
        return handleDeleteDoctor(id);
      },
      onCancel() {},
    });
  };

  const handleDeleteDoctor = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/doctor/${id}`, config);
      message.success('Doctor deleted successfully!');
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete doctor.');
    }
  };

  if (loading) {
    return <Spin tip="Loading..." style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} />;
  }

  // Summary statistics
  const totalUsers = users.length;
  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;
  const totalPending = pendingDoctors.length;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Hero/Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1890ff 0%, #43cea2 100%)',
        padding: '48px 0 32px 0',
        textAlign: 'center',
        color: 'white',
        marginBottom: 32,
        boxShadow: '0 4px 24px rgba(24,144,255,0.08)'
      }}>
        <h1 style={{ fontSize: 38, fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>Admin Dashboard</h1>
        <div style={{ fontSize: 18, opacity: 0.85 }}>Manage doctors, users, and appointments with ease</div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        {/* Summary Bar */}
        <Row gutter={24} style={{ marginBottom: 32 }} justify="center">
          <Col xs={12} sm={6}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(24,144,255,0.07)' }}>
              <Statistic title="Total Users" value={totalUsers} prefix={<TeamOutlined />} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(24,144,255,0.07)' }}>
              <Statistic title="Doctors" value={totalDoctors} prefix={<SolutionOutlined />} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(24,144,255,0.07)' }}>
              <Statistic title="Pending Approvals" value={totalPending} prefix={<ClockCircleOutlined />} valueStyle={{ color: totalPending > 0 ? '#faad14' : '#52c41a' }} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(24,144,255,0.07)' }}>
              <Statistic title="Appointments" value={totalAppointments} prefix={<CalendarOutlined />} />
            </Card>
          </Col>
        </Row>

        {error && <Alert message={error} type="error" showIcon closable onClose={() => setError(null)} style={{ marginBottom: 20 }} />}

        <Card style={{ borderRadius: 18, boxShadow: '0 4px 24px rgba(24,144,255,0.08)', marginBottom: 32 }}>
          <Tabs defaultActiveKey="1" type="card" size="large"
            items={[
              {
                key: '1',
                label: <span><ClockCircleOutlined /> Pending Doctor Approvals</span>,
                children: (
                  <List
                    itemLayout="horizontal"
                    dataSource={pendingDoctors}
                    locale={{ emptyText: 'No pending doctors.' }}
                    renderItem={(doctor) => (
                      <List.Item
                        actions={[
                          <Button type="primary" onClick={() => showApproveConfirm(doctor._id)}>
                            Approve
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<Avatar size={48} icon={<UserOutlined />} style={{ background: '#1890ff' }} />}
                          title={<span style={{ fontWeight: 600 }}>{doctor.name}</span>}
                          description={<>
                            <div>Email: {doctor.email}</div>
                            {doctor.specialty && <div>Specialty: <Tag color="geekblue">{doctor.specialty}</Tag></div>}
                          </>}
                        />
                      </List.Item>
                    )}
                  />
                )
              },
              {
                key: '2',
                label: <span><TeamOutlined /> All Users</span>,
                children: (
                  <Table
                    dataSource={users}
                    rowKey="_id"
                    columns={[
                      { title: 'Name', dataIndex: 'name' },
                      { title: 'Email', dataIndex: 'email' },
                      { title: 'Role', dataIndex: 'role', render: (role) => <Tag color={role === 'admin' ? 'volcano' : role === 'doctor' ? 'geekblue' : 'green'}>{role}</Tag> },
                    ]}
                    pagination={{ pageSize: 8 }}
                  />
                )
              },
              {
                key: '3',
                label: <span><SolutionOutlined /> All Doctors</span>,
                children: (
                  <Table
                    dataSource={doctors}
                    rowKey="_id"
                    columns={[
                      { title: 'Name', dataIndex: 'name' },
                      { title: 'Email', dataIndex: 'email' },
                      { title: 'Approved', dataIndex: 'isApproved', render: (isApproved) => isApproved ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag> },
                      {
                        title: 'Action',
                        key: 'action',
                        render: (text, record) => (
                          <Button type="primary" danger onClick={() => showDeleteConfirm(record._id)}>
                            Delete
                          </Button>
                        ),
                      },
                    ]}
                    pagination={{ pageSize: 8 }}
                  />
                )
              },
              {
                key: '4',
                label: <span><CalendarOutlined /> All Appointments</span>,
                children: (
                  <Table
                    dataSource={appointments}
                    rowKey="_id"
                    columns={[
                      { title: 'User', dataIndex: ['user', 'name'] },
                      { title: 'Doctor', dataIndex: ['doctor', 'user', 'name'] },
                      { title: 'Date', dataIndex: 'date', render: (date) => new Date(date).toLocaleString() },
                      { title: 'Status', dataIndex: 'status', render: (status) => <Tag color={status === 'Completed' ? 'green' : status === 'Cancelled' ? 'red' : 'blue'}>{status}</Tag> },
                    ]}
                    pagination={{ pageSize: 8 }}
                  />
                )
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard; 
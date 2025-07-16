import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { List, Card, Spin, Alert, Typography, Button, Modal, DatePicker, message, Upload, Avatar, Tag, Empty, Divider, Input, Form, Row, Col, Descriptions, Badge, Rate } from 'antd';
import { UserOutlined, UploadOutlined, CalendarOutlined, FileTextOutlined, SmileOutlined, ClockCircleOutlined, IdcardOutlined, BellOutlined, ExclamationCircleOutlined, StarOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './UserDashboard.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

function UserDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for booking modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingFiles, setBookingFiles] = useState([]);
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSymptoms, setBookingSymptoms] = useState('');

  // State for appointment details modal
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // State for review modal
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [reviewingAppointment, setReviewingAppointment] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('/api/appointments/my-appointments', config);
      console.log('Fetched appointments:', data);
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error("Could not fetch appointments");
      setError('Could not fetch your appointments.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const showBookingModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalVisible(true);
  };

  const handleBookingCancel = () => {
    setIsModalVisible(false);
    setSelectedDoctor(null);
    setBookingDate(null);
    setBookingFiles([]);
    setBookingNotes('');
    setBookingSymptoms('');
  };

  const handleBookingOk = async () => {
    if (!bookingDate) {
      return message.error('Please select a date and time for your appointment.');
    }

    // Validate that the selected date is in the future
    if (bookingDate.isBefore(moment())) {
      return message.error('Please select a future date and time for your appointment.');
    }

    setBookingLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const formData = new FormData();
      formData.append('doctorId', selectedDoctor._id);
      formData.append('date', bookingDate.toISOString());
      formData.append('notes', bookingNotes);
      formData.append('symptoms', bookingSymptoms);
      bookingFiles.forEach(file => formData.append('documents', file.originFileObj));
      
      const response = await axios.post('/api/appointments/book', formData, config);
      
      message.success(`Appointment booked successfully! Booking ID: ${response.data.bookingId}. A confirmation email has been sent.`);
      
      // Dispatch event to refresh notifications
      window.dispatchEvent(new Event('new-booking'));
      
      setIsModalVisible(false);
      setSelectedDoctor(null);
      setBookingDate(null);
      setBookingFiles([]);
      setBookingNotes('');
      setBookingSymptoms('');
      fetchAppointments(); // Refresh appointments list
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to book appointment.');
    }
    setBookingLoading(false);
  };

  const showCancelConfirm = (id) => {
    confirm({
      title: 'Are you sure you want to cancel this appointment?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      onOk() {
        return handleCancelAppointment(id);
      },
      onCancel() {},
    });
  };

  const handleCancelAppointment = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/appointments/${id}`, config);
      message.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (err) {
      message.error('Failed to cancel appointment.');
    }
  };

  const handleRescheduleAppointment = async (id, newDate) => {
    if (newDate && newDate.isBefore(moment())) {
      return message.error('Please select a future date and time.');
    }

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`/api/appointments/${id}/reschedule`, { date: newDate.toISOString() }, config);
      message.success('Appointment rescheduled successfully');
      fetchAppointments();
    } catch (err) {
      message.error('Failed to reschedule appointment.');
    }
  };

  const showAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailsModalVisible(true);
  };

  const showReviewModal = (appointment) => {
    setReviewingAppointment(appointment);
    setIsReviewModalVisible(true);
  };

  const handleReviewCancel = () => {
    setIsReviewModalVisible(false);
    setReviewingAppointment(null);
    setRating(0);
    setComment('');
  };

  const handleReviewSubmit = async () => {
    if (!rating || !comment) {
      return message.error('Please provide a rating and a comment.');
    }
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`/api/doctors/${reviewingAppointment.doctor._id}/reviews`, { rating, comment }, config);
      message.success('Review submitted successfully!');
      setIsReviewModalVisible(false);
    } catch (error) {
      message.error('Failed to submit review');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'green';
      case 'Cancelled':
        return 'red';
      case 'Completed':
        return 'blue';
      default:
        return 'orange';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed':
        return <BellOutlined style={{ color: '#52c41a' }} />;
      case 'Cancelled':
        return <BellOutlined style={{ color: '#ff4d4f' }} />;
      case 'Completed':
        return <BellOutlined style={{ color: '#1890ff' }} />;
      default:
        return <BellOutlined style={{ color: '#faad14' }} />;
    }
  };

  if (loading) {
    return <Spin tip="Loading Dashboard..." style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} />;
  }

  return (
    <div style={{
      padding: '60px 0',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center'
    }}>
      <Card style={{
        maxWidth: 900,
        width: '100%',
        margin: '0 auto',
        borderRadius: 20,
        boxShadow: '0 8px 32px rgba(80, 120, 200, 0.10)',
        border: '1px solid #e0e7ff',
        padding: 36
      }}>
        <Title level={3} style={{ color: '#3b82f6', textAlign: 'center', marginBottom: 0, fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>
          <SmileOutlined style={{ color: '#f59e42', marginRight: 12, fontSize: 32 }} /> Your Appointments
        </Title>
        <Divider style={{ borderColor: '#3b82f6' }} />
        {error && <Alert message={error} type="error" showIcon closable onClose={() => setError(null)} style={{ marginBottom: 20 }} />}
        {appointments.length > 0 ? (
          <List
            style={{ marginBottom: 40 }}
            itemLayout="vertical"
            dataSource={appointments}
            bordered
            renderItem={item => (
              <div className="appointment-card">
                <List.Item
                  style={{
                    background: '#f0f9ff',
                    borderRadius: 16,
                    marginBottom: 18,
                    boxShadow: '0 2px 12px rgba(80, 120, 200, 0.08)',
                    border: '1.5px solid #e0e7ff',
                    transition: 'box-shadow 0.3s, transform 0.3s',
                  }}
                  actions={[
                    <Button type="primary" size="small" onClick={() => showAppointmentDetails(item)} style={{ borderRadius: 8, fontWeight: 600 }}>
                      Details
                    </Button>,
                    item.status !== 'Cancelled' && item.status !== 'Completed' && (
                      <>
                        <Button danger size="small" onClick={() => showCancelConfirm(item._id)} style={{ borderRadius: 8, fontWeight: 600 }}>
                          Cancel
                        </Button>
                        <DatePicker
                          showTime
                          format="YYYY-MM-DD HH:mm"
                          onChange={(date) => handleRescheduleAppointment(item._id, date)}
                          placeholder="Reschedule"
                          style={{ width: 140, borderRadius: 8 }}
                          disabledDate={(current) => current && current < moment().startOf('day')}
                        />
                      </>
                    ),
                    item.status === 'Completed' && (
                      <Button icon={<StarOutlined />} onClick={() => showReviewModal(item)} style={{ borderRadius: 8, fontWeight: 600 }}>
                        Rate & Review
                      </Button>
                    ),
                    item.documents && item.documents.length > 0 && (
                      <Paragraph>
                        <strong>Documents:</strong>
                        {item.documents.map((doc, idx) => (
                          <a key={idx} href={`${doc}`} target="_blank" rel="noopener noreferrer" style={{ marginRight: 8 }}>
                            View Document {idx + 1}
                          </a>
                        ))}
                      </Paragraph>
                    )
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.doctor?.profileImageUrl}
                        style={{ backgroundColor: '#3b82f6', width: 56, height: 56, fontSize: 28 }}
                        icon={!item.doctor?.profileImageUrl && <CalendarOutlined />}
                      />
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ color: '#2563eb', fontWeight: 700, fontSize: 18 }}>
                          Appointment with Dr. {item.doctor?.user?.name || 'N/A'}
                        </span>
                        <Tag color={getStatusColor(item.status)} icon={getStatusIcon(item.status)} style={{ fontWeight: 600, fontSize: 15, borderRadius: 8, marginLeft: 8, padding: '2px 12px' }}>
                          {item.status}
                        </Tag>
                        <Badge count={item.bookingId} style={{ backgroundColor: '#52c41a', marginLeft: 8 }} />
                      </div>
                    }
                    description={
                      <div style={{ marginTop: 8 }}>
                        <div style={{ marginBottom: 4, fontSize: 16 }}>
                          <CalendarOutlined style={{ marginRight: 6, color: '#3b82f6' }} />
                          <Text strong>{new Date(item.date).toLocaleString()}</Text>
                        </div>
                        {item.doctor?.specialty && (
                          <div style={{ marginBottom: 4, fontSize: 15 }}>
                            <IdcardOutlined style={{ marginRight: 6, color: '#10b981' }} />
                            <Text>{item.doctor.specialty}</Text>
                          </div>
                        )}
                        {item.doctor?.contactPhone && (
                          <div style={{ marginBottom: 4, fontSize: 15 }}>
                            <PhoneOutlined style={{ marginRight: 6, color: '#faad14' }} />
                            <Text>{item.doctor.contactPhone}</Text>
                          </div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              </div>
            )}
          />
        ) : (
          <Empty description={<span>You have no upcoming appointments.<br /><Link to="/find-doctor">Book your first one now!</Link></span>} imageStyle={{ height: 60 }} style={{ margin: '32px 0' }} />
        )}

        <Title level={2} style={{ color: '#10b981', textAlign: 'center', marginBottom: 0 }}>
          <UserOutlined style={{ color: '#3b82f6', marginRight: 12 }} /> Available Doctors
        </Title>
        <Divider style={{ borderColor: '#10b981' }} />
        {selectedDoctor && (
          <Modal
            title={<span><CalendarOutlined style={{ color: '#3b82f6', marginRight: 8 }} />Book Appointment with <b>{selectedDoctor.user.name}</b></span>}
            open={isModalVisible}
            onOk={handleBookingOk}
            onCancel={handleBookingCancel}
            confirmLoading={bookingLoading}
            footer={[
              <Button key="back" onClick={handleBookingCancel}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" loading={bookingLoading} onClick={handleBookingOk}>
                Book Now
              </Button>,
            ]}
          >
            <Form layout="vertical">
              <Form.Item label="Select Date and Time">
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  onChange={(date) => setBookingDate(date)}
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < moment().startOf('day')}
                />
              </Form.Item>
              <Form.Item label="Symptoms">
                <TextArea rows={2} placeholder="e.g. Headache, Fever" value={bookingSymptoms} onChange={e => setBookingSymptoms(e.target.value)} />
              </Form.Item>
              <Form.Item label="Notes for the Doctor">
                <TextArea rows={2} placeholder="e.g. Past medical history" value={bookingNotes} onChange={e => setBookingNotes(e.target.value)} />
              </Form.Item>
              <Form.Item label="Upload Medical Documents">
                <Upload
                  beforeUpload={() => false}
                  onChange={({ fileList }) => setBookingFiles(fileList)}
                  multiple
                >
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
              </Form.Item>
            </Form>
          </Modal>
        )}
        
        <Modal
          title="Rate and Review"
          open={isReviewModalVisible}
          onOk={handleReviewSubmit}
          onCancel={handleReviewCancel}
        >
          <Form>
            <Form.Item label="Rating">
              <Rate onChange={setRating} value={rating} />
            </Form.Item>
            <Form.Item label="Comment">
              <TextArea rows={4} onChange={(e) => setComment(e.target.value)} value={comment} />
            </Form.Item>
          </Form>
        </Modal>

        {selectedAppointment && (
          <Modal
            title="Appointment Details"
            open={detailsModalVisible}
            onCancel={() => setDetailsModalVisible(false)}
            footer={[
              <Button key="close" onClick={() => setDetailsModalVisible(false)}>
                Close
              </Button>,
            ]}
            width={700}
          >
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Booking ID">{selectedAppointment.bookingId}</Descriptions.Item>
              <Descriptions.Item label="Doctor">{selectedAppointment.doctor.user.name}</Descriptions.Item>
              <Descriptions.Item label="Date">{new Date(selectedAppointment.date).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedAppointment.status)}>{selectedAppointment.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Symptoms">{selectedAppointment.symptoms || 'Not provided'}</Descriptions.Item>
              <Descriptions.Item label="Notes">{selectedAppointment.notes || 'Not provided'}</Descriptions.Item>
              <Descriptions.Item label="Documents">
                {selectedAppointment.documents && selectedAppointment.documents.length > 0 ? (
                  selectedAppointment.documents.map((doc, idx) => (
                    <a key={idx} href={`${doc}`} target="_blank" rel="noopener noreferrer" style={{ marginRight: 8 }}>
                      View Document {idx + 1}
                    </a>
                  ))
                ) : (
                  'No documents uploaded'
                )}
              </Descriptions.Item>
            </Descriptions>
          </Modal>
        )}
      </Card>
    </div>
  );
}

export default UserDashboard;
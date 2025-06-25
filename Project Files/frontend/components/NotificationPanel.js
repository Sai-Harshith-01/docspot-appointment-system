import React, { useState, useEffect } from 'react';
import { Badge, Popover, List, Typography, Tag, Button, Empty, Spin, message } from 'antd';
import { BellOutlined, CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text } = Typography;

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('http://localhost:5000/api/appointments/my-appointments', config);
      
      // Convert appointments to notifications
      const appointmentNotifications = data.map(appointment => ({
        id: appointment._id,
        type: 'appointment',
        title: `Appointment with Dr. ${appointment.doctor?.user?.name || 'N/A'}`,
        message: `Your appointment (${appointment.bookingId}) is ${appointment.status.toLowerCase()}`,
        status: appointment.status,
        date: appointment.date,
        bookingId: appointment.bookingId,
        read: false,
        timestamp: appointment.updatedAt || appointment.createdAt
      }));

      setNotifications(appointmentNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error.response && error.response.status === 401) {
        // Token is invalid or expired
        message.error('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        // Force a re-render of the whole app to update auth state
        window.location.reload(); 
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    
    // Listen for custom event to refetch notifications
    const handleNewBooking = () => fetchNotifications();
    window.addEventListener('new-booking', handleNewBooking);
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('new-booking', handleNewBooking);
    };
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'Cancelled':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'Completed':
        return <CheckCircleOutlined style={{ color: '#1890ff' }} />;
      default:
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const notificationContent = (
    <div style={{ width: 350, maxHeight: 400, overflowY: 'auto' }}>
      <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong>Notifications</Text>
        <Button size="small" onClick={fetchNotifications} loading={loading}>
          Refresh
        </Button>
      </div>
      
      {loading ? (
        <div style={{ padding: 20, textAlign: 'center' }}>
          <Spin size="small" />
        </div>
      ) : notifications.length > 0 ? (
        <List
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item
              style={{ 
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: notification.read ? 'transparent' : '#f6ffed'
              }}
            >
              <List.Item.Meta
                avatar={getStatusIcon(notification.status)}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ fontSize: '14px' }}>{notification.title}</Text>
                    <Tag color={getStatusColor(notification.status)} size="small">
                      {notification.status}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <div style={{ marginBottom: 4 }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {notification.message}
                      </Text>
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        <CalendarOutlined style={{ marginRight: 4 }} />
                        {new Date(notification.date).toLocaleString()}
                      </Text>
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <Text code style={{ fontSize: '11px' }}>
                        ID: {notification.bookingId}
                      </Text>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: '11px' }}>
                        {formatDate(notification.timestamp)}
                      </Text>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty 
          description="No notifications" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: 20 }}
        />
      )}
    </div>
  );

  return (
    <Popover
      content={notificationContent}
      title={null}
      trigger="click"
      visible={visible}
      onVisibleChange={setVisible}
      placement="bottomRight"
      overlayStyle={{ width: 350 }}
    >
      <Badge count={unreadCount} size="small">
        <Button 
          type="text" 
          icon={<BellOutlined />} 
          style={{ color: '#fff' }}
        />
      </Badge>
    </Popover>
  );
};

export default NotificationPanel; 
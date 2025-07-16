import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { List, Card, Typography, Spin, Alert, Button, Modal, DatePicker, message, Input, Select, Row, Col, Rate, Tabs, Avatar, Tag, Divider, Badge, Space, Empty, Tooltip, Skeleton } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { debounce } from 'lodash';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  EnvironmentOutlined, 
  PhoneOutlined, 
  StarFilled, 
  MessageOutlined,
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  HeartOutlined
} from '@ant-design/icons';
import queryString from 'query-string';
import './FindDoctor.css';

const { Title, Text, Paragraph } = Typography;
const { Search, TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const FindDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'experience', 'name'

  // State for booking modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSymptoms, setBookingSymptoms] = useState('');

  // State for favorites
  const [favorites, setFavorites] = useState(new Set());

  // Sync state with URL on mount
  useEffect(() => {
    const parsed = queryString.parse(location.search);
    setSearchTerm(parsed.search || '');
    setSelectedSpecialty(parsed.specialty || null);
    setSortBy(parsed.sortBy || 'rating');
  }, [location.search]);

  // Update URL when filters/search change
  useEffect(() => {
    const query = {};
    if (searchTerm) query.search = searchTerm;
    if (selectedSpecialty) query.specialty = selectedSpecialty;
    if (sortBy && sortBy !== 'rating') query.sortBy = sortBy;
    const search = queryString.stringify(query);
    if (search !== location.search.replace(/^\?/, '')) {
      navigate({ search: search ? `?${search}` : '' }, { replace: true });
    }
  }, [searchTerm, selectedSpecialty, sortBy]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/doctors');
        setDoctors(res.data);
      } catch (err) {
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const specialties = useMemo(() => {
    const uniqueSpecialties = [...new Set(doctors.map(doc => doc.specialty))];
    return uniqueSpecialties;
  }, [doctors]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const sortDoctors = (docs) => {
    switch (sortBy) {
      case 'rating':
        return [...docs].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'experience':
        return [...docs].sort((a, b) => (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0));
      case 'name':
        return [...docs].sort((a, b) => a.user.name.localeCompare(b.user.name));
      default:
        return docs;
    }
  };

  const filteredDoctors = useMemo(() => {
    let filtered = doctors.filter(doctor => {
      const nameMatch = doctor.user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const specialtyMatch = !selectedSpecialty || doctor.specialty === selectedSpecialty;
      return nameMatch && specialtyMatch;
    });
    return sortDoctors(filtered);
  }, [doctors, searchTerm, selectedSpecialty, sortBy]);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalVisible(true);
  };

  const handleBookingCancel = () => {
    setIsModalVisible(false);
    setSelectedDoctor(null);
    setBookingDate(null);
    setGuestEmail('');
    setBookingNotes('');
    setBookingSymptoms('');
  };

  const handleBookingOk = async () => {
    if (!bookingDate) {
      return message.error('Please select a date for your appointment.');
    }

    // Validate that the selected date is in the future
    if (bookingDate.isBefore(moment())) {
      return message.error('Please select a future date and time for your appointment.');
    }

    const token = localStorage.getItem('token');
    setBookingLoading(true);

    try {
      const formData = new FormData();
      formData.append('doctorId', selectedDoctor._id);
      formData.append('date', bookingDate.toISOString());
      formData.append('notes', bookingNotes);
      formData.append('symptoms', bookingSymptoms);

      let config = {};
      if (token) {
        // Logged-in user booking
        config = { headers: { Authorization: `Bearer ${token}` } };
      } else {
        // Guest user booking
        if (!guestEmail) {
          setBookingLoading(false);
          return message.error('Please enter your email address to book as a guest.');
        }
        formData.append('guestEmail', guestEmail);
      }
      
      const response = await axios.post('http://localhost:5000/api/appointments/book', formData, config);
      message.success(`Appointment booked successfully! Booking ID: ${response.data.bookingId}. A confirmation email has been sent.`);
      
      // Dispatch event to refresh notifications
      window.dispatchEvent(new Event('new-booking'));

      setIsModalVisible(false);
      handleBookingCancel(); // Reset form
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#52c41a';
    if (rating >= 4.0) return '#1890ff';
    if (rating >= 3.5) return '#faad14';
    return '#ff4d4f';
  };

  const toggleFavorite = (id) => {
    const updated = new Set(favorites);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setFavorites(updated);
  };

  // Helper for profile image fallback
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    return parts.length === 1 ? parts[0][0] : parts[0][0] + parts[1][0];
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div className="find-doctor-container">
      {/* Hero Section */}
      <div className="hero-section">
        <Title level={1}>Find Your Perfect Doctor</Title>
        <Paragraph>Search from our network of qualified professionals</Paragraph>
        <Search
          size="large"
          placeholder="Search by doctor's name or specialty"
          onSearch={setSearchTerm}
          onChange={e => debouncedSearch(e.target.value)}
          enterButton={<><SearchOutlined /> Search</>}
        />
      </div>

      <div className="filters-row">
        <Row gutter={[16, 16]} className="filters-row">
          <Col xs={24} sm={8}>
            <Select
              placeholder="Filter by specialty"
              style={{ width: '100%' }}
              onChange={value => setSelectedSpecialty(value)}
              allowClear
              size="large"
              suffixIcon={<FilterOutlined />}
            >
              {specialties.map(s => <Option key={s} value={s}>{s}</Option>)}
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Select
              placeholder="Sort by"
              style={{ width: '100%' }}
              onChange={value => setSortBy(value)}
              size="large"
              defaultValue="rating"
              suffixIcon={<SortAscendingOutlined />}
            >
              <Option value="rating">Rating</Option>
              <Option value="experience">Experience</Option>
              <Option value="name">Name</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Button
              type={sortBy === 'experience' ? 'primary' : 'default'}
              block
              size="large"
              icon={<ClockCircleOutlined />}
              style={{ width: '100%' }}
              onClick={() => setSortBy('experience')}
            >
              Search by Experience
            </Button>
          </Col>
        </Row>
      </div>

      {/* Results Count */}
      <Text style={{ display: 'block', marginBottom: '16px', color: '#666' }}>
        Found {filteredDoctors.length} doctors
      </Text>

      {/* Doctors List */}
      {filteredDoctors.length === 0 ? (
        <div style={{ padding: '60px 0' }}>
          <Empty
            description="No doctors match your search."
            imageStyle={{ height: 60 }}
          >
            <Button type="primary" onClick={() => {
              setSearchTerm('');
              setSelectedSpecialty(null);
              setSortBy('rating');
            }}>
              Clear Filters
            </Button>
          </Empty>
        </div>
      ) : (
        <List
          grid={{ gutter: 24, xs: 1, sm: 2, lg: 3 }}
          dataSource={filteredDoctors}
          renderItem={doctor => (
            <List.Item>
              <Card
                className="doctor-card"
                hoverable
                style={{ position: 'relative' }}
                bodyStyle={{ padding: 20, minHeight: 220, display: 'flex', flexDirection: 'column' }}
                cover={
                  <div style={{ position: 'relative', height: 180, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {doctor.profileImageUrl ? (
                      <img
                        alt={doctor.user.name}
                        src={doctor.profileImageUrl.startsWith('http') ? doctor.profileImageUrl : `http://localhost:5000${doctor.profileImageUrl}`}
                        style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                        onError={handleImageError}
                      />
                    ) : null}
                    {/* Fallback Avatar with initials */}
                    <Avatar
                      size={120}
                      style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', background: '#1890ff', color: '#fff', fontSize: 36, display: doctor.profileImageUrl ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}
                      icon={!doctor.profileImageUrl && <UserOutlined />}
                    >
                      {!doctor.profileImageUrl && getInitials(doctor.user.name)}
                    </Avatar>
                  </div>
                }
              >
                {/* Quick Actions */}
                <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 2, display: 'flex', gap: 8 }}>
                  <Tooltip title={favorites.has(doctor._id) ? 'Unfavorite' : 'Favorite'}>
                    <Button shape="circle" icon={<HeartOutlined />} size="small" onClick={() => toggleFavorite(doctor._id)} style={{ color: favorites.has(doctor._id) ? 'red' : undefined }} />
                  </Tooltip>
                  <Tooltip title="Message">
                    <Button shape="circle" icon={<MessageOutlined />} size="small" />
                  </Tooltip>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <Title level={4} style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}>
                    {doctor.user.name}
                    {doctor.rating >= 4.5 && <Tag color="green" style={{ marginLeft: 8 }}>Top Rated</Tag>}
                    {doctor.rating >= 4.0 && doctor.rating < 4.5 && <Tag color="blue" style={{ marginLeft: 8 }}>Highly Rated</Tag>}
                    {doctor.rating < 4.0 && <Tag color="orange" style={{ marginLeft: 8 }}>Trusted</Tag>}
                  </Title>
                  <Text type="secondary" style={{ display: 'block', marginBottom: 2 }}>
                    {doctor.bio ? doctor.bio.split(/[.!?]/)[0] : doctor.specialty}
                  </Text>
                  <div style={{ marginTop: 4 }}>
                    {doctor.expertise?.map((item, i) => (
                      <Tag color="blue" key={i}>{item}</Tag>
                    ))}
                  </div>
                </div>
                <Space direction="vertical" size="small" style={{ marginBottom: 16 }}>
                  <div>
                    <Rate disabled value={doctor.rating || 0} style={{ fontSize: 14 }} />
                    <Text style={{ marginLeft: 8 }}>({doctor.numberOfReviews || 0})</Text>
                  </div>
                  <Text>
                    <ClockCircleOutlined style={{ marginRight: 8 }} />
                    {doctor.yearsOfExperience} years experience
                  </Text>
                  <Text>
                    <EnvironmentOutlined style={{ marginRight: 8 }} />
                    {doctor.location || 'Location not specified'}
                  </Text>
                </Space>
                <Button type="primary" block style={{ height: 44, borderRadius: 8, fontSize: 16, marginTop: 'auto' }} onClick={() => handleBookAppointment(doctor)}>Book Appointment</Button>
              </Card>
            </List.Item>
          )}
        />
      )}

      {/* Booking Modal */}
      <Modal
        title={<Title level={4}>Book Appointment with Dr. {selectedDoctor?.user.name}</Title>}
        visible={isModalVisible}
        onOk={handleBookingOk}
        onCancel={handleBookingCancel}
        confirmLoading={bookingLoading}
        width={600}
        style={{ top: 20 }}
        okText="Confirm Booking"
        cancelText="Cancel"
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Book Appointment" key="1">
            <div style={{ padding: '20px 0' }}>
              <Row gutter={[16, 24]}>
                {!localStorage.getItem('token') && (
                  <Col span={24}>
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Your email address"
                      value={guestEmail}
                      onChange={e => setGuestEmail(e.target.value)}
                      size="large"
                    />
                  </Col>
                )}
                <Col span={24}>
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm"
                    placeholder="Select appointment date and time"
                    onChange={value => setBookingDate(value)}
                    style={{ width: '100%' }}
                    size="large"
                    disabledDate={current => current && current < moment().startOf('day')}
                  />
                </Col>
                <Col span={24}>
                  <TextArea
                    placeholder="Describe your symptoms"
                    value={bookingSymptoms}
                    onChange={e => setBookingSymptoms(e.target.value)}
                    rows={4}
                  />
                </Col>
                <Col span={24}>
                  <TextArea
                    placeholder="Additional notes for the doctor"
                    value={bookingNotes}
                    onChange={e => setBookingNotes(e.target.value)}
                    rows={3}
                  />
                </Col>
              </Row>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Reviews" key="2">
            {selectedDoctor?.reviews?.length ? (
              <List
                itemLayout="horizontal"
                dataSource={selectedDoctor.reviews}
                renderItem={review => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={<span>{review.userName} <Rate disabled value={review.rating} style={{ fontSize: 14, marginLeft: 8 }} /></span>}
                      description={review.comment}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Text type="secondary">No reviews yet.</Text>
            )}
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default FindDoctor; 
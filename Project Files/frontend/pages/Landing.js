// File: Landing.jsx
import React, { useEffect } from 'react';
import { Button, Typography, Row, Col, Card, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import {
  CalendarOutlined,
  SearchOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  StarFilled,
  EnvironmentOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import AOS from 'aos';
import 'aos/dist/aos.css';

const { Title, Paragraph, Text } = Typography;

const stethoscopeImg = 'https://img.freepik.com/premium-photo/stethoscope-with-calendar-page-date-blue-background-doctor-appointment-medical-concept_293060-176.jpg';

const testimonials = [
  {
    name: 'Kavya Sharma',
    text: 'Booking an appointment was so easy and quick! The doctors are very professional and the platform is super user-friendly.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Sai Harshith',
    text: 'I love how I can manage all my appointments and health records in one place. Highly recommended!',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Dr. Aruna Mahendrakar',
    text: 'As a doctor, this platform makes it easy to connect with patients and manage my schedule efficiently.',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
];

// 🔁 Reusable Feature Card Component
const FeatureCard = ({ icon, title, description, delay }) => (
  <Card
    bordered={false}
    hoverable
    style={{
      textAlign: 'center',
      borderRadius: 12,
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      transition: 'transform 0.3s ease',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    {icon}
    <Title level={4}>{title}</Title>
    <Paragraph>{description}</Paragraph>
  </Card>
);

// 🔁 Reusable Testimonial Card
const TestimonialCard = ({ name, text, avatar, delay }) => (
  <Card
    bordered={false}
    style={{
      borderRadius: 12,
      minHeight: 240,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    }}
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
      <Avatar src={avatar} size={48} style={{ marginRight: 12 }} alt={`${name}'s avatar`} />
      <Text strong>{name}</Text>
    </div>
    <Paragraph style={{ fontSize: 15, color: '#555' }}>"{text}"</Paragraph>
    <div style={{ marginTop: 8 }}>
      {[...Array(5)].map((_, i) => (
        <StarFilled key={i} style={{ color: '#ffc107', fontSize: 16 }} />
      ))}
    </div>
  </Card>
);

const Landing = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div style={{ background: '#fff', fontFamily: 'Segoe UI, sans-serif' }}>
      <Helmet>
        <title>Book Doctor Appointments Online | DocSpot</title>
        <meta name="description" content="Find, book, and manage doctor appointments quickly and securely online." />
      </Helmet>

      {/* Hero Section */}
      <section
        style={{
          background: '#F5FAFF',
          padding: '80px 20px 60px',
          color: '#333',
          borderBottom: '1px solid #eaeaea',
        }}
        data-aos="fade-down"
      >
        <Row justify="center" align="middle" gutter={[48, 32]}>
          <Col xs={24} md={12} style={{ textAlign: 'center' }}>
            <img
              loading="lazy"
              src={stethoscopeImg}
              alt="Stethoscope with calendar"
              style={{ width: '100%', maxWidth: 300, borderRadius: 16 }}
              data-aos="zoom-in"
            />
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'left' }}>
            <Paragraph style={{ fontSize: 18, color: '#666' }}>
              Fast, Secure, Trusted Healthcare
            </Paragraph>
            <Title style={{ fontSize: 36, fontWeight: 800, margin: '12px 0' }}>
              Book Appointments Online—Quick & Easy
            </Title>
            <Paragraph style={{ fontSize: 18, color: '#444' }}>
              Paperless healthcare, designed for modern convenience.
            </Paragraph>
            <Link to="/find-doctor">
              <Button
                size="large"
                shape="round"
                style={{
                  background: '#007BFF',
                  color: '#fff',
                  fontSize: 16,
                  padding: '0 28px',
                  marginTop: 24,
                  boxShadow: '0 2px 6px rgba(0, 123, 255, 0.3)',
                  border: 'none',
                }}
                data-aos="fade-up"
              >
                Book Now
              </Button>
            </Link>
            <Row gutter={24} style={{ marginTop: 24 }}>
              <Col><SafetyCertificateOutlined style={{ fontSize: 24, color: '#007BFF' }} /> <Text>Certified</Text></Col>
              <Col><LockOutlined style={{ fontSize: 24, color: '#007BFF' }} /> <Text>Secure</Text></Col>
              <Col><EnvironmentOutlined style={{ fontSize: 24, color: '#007BFF' }} /> <Text>Eco-Conscious</Text></Col>
            </Row>
          </Col>
        </Row>
      </section>

      {/* How It Works */}
      <section style={{ padding: '60px 20px 40px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 48, color: '#007BFF' }} data-aos="fade-up">
          How It Works
        </Title>
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} md={8}>
            <FeatureCard
              icon={<SearchOutlined style={{ fontSize: 36, color: '#007BFF', marginBottom: 8 }} />}
              title="Find a Doctor"
              description="Search by specialty, location, or name with ease."
              delay={0}
            />
          </Col>
          <Col xs={24} md={8}>
            <FeatureCard
              icon={<CalendarOutlined style={{ fontSize: 36, color: '#007BFF', marginBottom: 8 }} />}
              title="Book Instantly"
              description="Select your slot and confirm in seconds."
              delay={100}
            />
          </Col>
          <Col xs={24} md={8}>
            <FeatureCard
              icon={<UserOutlined style={{ fontSize: 36, color: '#007BFF', marginBottom: 8 }} />}
              title="Manage Easily"
              description="Track all appointments and access records."
              delay={200}
            />
          </Col>
        </Row>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '60px 20px', background: '#f9fcff' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 48, color: '#007BFF' }} data-aos="fade-up">
          What Our Users Say
        </Title>
        <Row gutter={[32, 32]} justify="center">
          {testimonials.map((t, index) => (
            <Col xs={24} md={8} key={index}>
              <TestimonialCard {...t} delay={index * 100} />
            </Col>
          ))}
        </Row>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '40px 20px', background: '#F5FAFF', color: '#888' }}>
        <Text>© 2025 DocSpot. All rights reserved.</Text>
      </footer>
    </div>
  );
};

export default Landing;

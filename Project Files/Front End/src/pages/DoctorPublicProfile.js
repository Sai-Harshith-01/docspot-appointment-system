import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Spin, Alert, Avatar, Tag, Rate, Divider, List } from 'antd';
import axios from 'axios';
import { UserOutlined, StarFilled } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const DoctorPublicProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctors/${id}`);
        setDoctor(res.data);
      } catch (err) {
        setError('Failed to load doctor profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) return <Spin style={{ display: 'block', margin: '60px auto' }} />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;
  if (!doctor) return null;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24 }}>
      <Card bordered style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Avatar
            src={doctor.user?.avatar || null}
            size={72}
            icon={<UserOutlined />}
            style={{ marginRight: 20 }}
          />
          <div>
            <Title level={3} style={{ margin: 0 }}>{doctor.user?.name}</Title>
            <Text type="secondary">{doctor.specialty}</Text>
            <div style={{ marginTop: 8 }}>
              <Rate disabled allowHalf value={doctor.rating || 0} style={{ fontSize: 18 }} />
              <Text style={{ marginLeft: 8 }}>{doctor.rating?.toFixed(1) || 'N/A'}</Text>
              {doctor.rating >= 4.5 && <Tag color="green" style={{ marginLeft: 8 }}>Top Rated</Tag>}
              {doctor.rating >= 4.0 && doctor.rating < 4.5 && <Tag color="blue" style={{ marginLeft: 8 }}>Highly Rated</Tag>}
              {doctor.rating < 4.0 && <Tag color="orange" style={{ marginLeft: 8 }}>Trusted</Tag>}
            </div>
          </div>
        </div>
        <Paragraph><b>Experience:</b> {doctor.yearsOfExperience} years</Paragraph>
        <Paragraph><b>Qualifications:</b> {doctor.qualifications?.join(', ')}</Paragraph>
        <Paragraph><b>Expertise:</b> {doctor.expertise?.map((item, i) => (
          <Tag color="blue" key={i}>{item}</Tag>
        ))}</Paragraph>
        <Divider />
        <Title level={4}>About</Title>
        <Paragraph>{doctor.bio || 'No bio available.'}</Paragraph>
        <Divider />
        <Title level={4}>Reviews</Title>
        {doctor.reviews?.length ? (
          <List
            itemLayout="horizontal"
            dataSource={doctor.reviews}
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
      </Card>
    </div>
  );
};

export default DoctorPublicProfile; 
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Spin, message, TimePicker } from 'antd';
import axios from 'axios';
import moment from 'moment';

const DoctorProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/doctors/profile', config);
        setDoctor(data);
        form.setFieldsValue({
          ...data,
          consultationHours: [
            data.consultationHours.start ? moment(data.consultationHours.start, 'HH:mm') : null,
            data.consultationHours.end ? moment(data.consultationHours.end, 'HH:mm') : null
          ]
        });
      } catch (error) {
        message.error('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [form, config]);

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        consultationHours: {
          start: values.consultationHours[0].format('HH:mm'),
          end: values.consultationHours[1].format('HH:mm'),
        },
        qualifications: values.qualifications.split(',').map(q => q.trim())
      };
      await axios.put('http://localhost:5000/api/doctors/profile', payload, config);
      message.success('Profile updated successfully');
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} initialValues={doctor}>
      <Form.Item name="specialty" label="Specialty">
        <Input />
      </Form.Item>
      <Form.Item name="experience" label="Experience (in years)">
        <Input type="number" />
      </Form.Item>
      <Form.Item name="qualifications" label="Qualifications (comma-separated)">
        <Input />
      </Form.Item>
      <Form.Item name="consultationHours" label="Consultation Hours">
        <TimePicker.RangePicker format="HH:mm" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update Profile
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DoctorProfile; 
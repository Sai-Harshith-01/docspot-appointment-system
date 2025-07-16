import React from 'react';
import { Alert } from 'antd';
import { useNavigate } from 'react-router-dom';

const ProfileCompletionAlert = () => {
  const navigate = useNavigate();
  return (
    <Alert
      message={<span style={{ fontWeight: 700, fontSize: 20, color: '#ad6800' }}>Complete Your Profile</span>}
      description={
        <span style={{ fontSize: 16, color: '#614700' }}>
          To start receiving appointments, please complete your profile.<br />
          <a
            onClick={() => navigate('/complete-profile')}
            style={{
              color: '#fa8c16',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: 16,
              marginTop: 8,
              display: 'inline-block'
            }}
          >
            Click here to complete your profile.
          </a>
        </span>
      }
      type="warning"
      showIcon
      style={{
        marginBottom: 32,
        background: '#fffbe6',
        border: '1.5px solid #ffe58f',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(255, 215, 0, 0.08)',
        padding: '20px 32px',
        fontSize: 16
      }}
    />
  );
};

export default ProfileCompletionAlert; 
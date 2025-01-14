import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, TextField, Tooltip, Stack, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BadgeIcon from '@mui/icons-material/Badge';
import CallIcon from '@mui/icons-material/Call';
import PaymentIcon from '@mui/icons-material/Payment';

const CustomerProfile = ({ customerData }) => {
  const [editableField, setEditableField] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const [profile, setProfile] = useState(customerData);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (field) => {
    setEditableField(field);
    setEditedValue(profile[field]);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
    } else {
      alert('No token found. Please log in first.');
      navigate('/login');
    }
  }, [navigate]);

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:5456/profile/customer?attribute=${editableField}&value=${editedValue}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update profile');
      }

      setProfile((prev) => ({ ...prev, [editableField]: editedValue }));
      setEditableField(null);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditableField(null);
    setEditedValue('');
  };

  const renderField = (field, label, Icon) => (
    <Box display="flex" alignItems="center" mb={2}>
      <Box paddingRight="10px">
        <Icon />
      </Box>
      <Typography variant="body1" sx={{ fontWeight: 'bold', minWidth: '150px' }}>
        {label}:
      </Typography>
      {editableField === field ? (
        <Box display="flex" alignItems="center" flex={1}>
          <TextField
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            size="small"
            sx={{ flex: 1, mr: 1 }}
          />
          <IconButton onClick={handleSave} color="primary">
            <CheckIcon />
          </IconButton>
          <IconButton onClick={handleCancel} color="error">
            <CloseIcon />
          </IconButton>
        </Box>
      ) : (
        <Box display="flex" alignItems="center" flex={1}>
          <Typography variant="body2" sx={{ flex: 1 }}>
            {profile[field]}
          </Typography>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(field)} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 600,
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Stack direction="row" gap="20px" alignItems="center" paddingBottom="20px">
        <AccountCircleIcon />
        <Typography variant="h5">Customer Profile</Typography>
      </Stack>
      <Divider />

      {renderField('name', 'Name', BadgeIcon)}
      {renderField('contactInfo', 'Contact Info', CallIcon)}
      {renderField('preferredPaymentMethod', 'Preferred Payment Method', PaymentIcon)}
    </Box>
  );
};

export default CustomerProfile;

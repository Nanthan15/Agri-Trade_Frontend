import React, { useState , useEffect} from 'react';
import { Box, Typography, IconButton, TextField, Tooltip, Stack, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BadgeIcon from '@mui/icons-material/Badge';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import CallIcon from '@mui/icons-material/Call';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
const FarmerProfile = ({ farmerData}) => {
  const [editableField, setEditableField] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const [profile, setProfile] = useState(farmerData);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (field) => {
    setEditableField(field);
    setEditedValue(profile[field]);
  };

  useEffect(() => {
            const savedAuth = JSON.parse(localStorage.getItem('authData'));
            if (savedAuth && savedAuth.token) {
                setToken(savedAuth.token);
            } else {
                alert('No token found. Please log in first.');
                navigate('/login');
            }
        }, [navigate]);

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:5456/profile/farmer?attribute=${editableField}&value=${editedValue}`,
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

  const renderField = (field, label) => (
    <Box display="flex" alignItems="center" mb={2}>
        <Box paddingRight={'10px'}>
        {field==='name'?(
          <BadgeIcon></BadgeIcon>
        ):(
          <></>
        )}
        {field==='farmType'?(
          <AgricultureIcon></AgricultureIcon>
        ):(
          <></>
        )}
        {field==='contactInfo'?(
          <CallIcon></CallIcon>
        ):(
          <></>
        )}
        {field==='farmLocation'?(
          <EditLocationIcon></EditLocationIcon>
        ):(
          <></>
        )}
        {field==='certification'?(
          <WorkspacePremiumIcon></WorkspacePremiumIcon>
        ):(
          <></>
        )}
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
      <Stack direction={'row'} gap={'20px'} alignItems={'center'} paddingBottom={'20px'}>
      <AccountCircleIcon></AccountCircleIcon>
      <Typography variant="h5" >
        Farmer Profile
      </Typography>
      </Stack>
      <Divider/>
      
      
      {renderField('name', 'Name')}
      {renderField('farmType', 'Farm Type')}
      {renderField('contactInfo', 'Contact Info')}
      {renderField('farmLocation', 'Farm Location')}
      {renderField('certification', 'Certification')}
    </Box>
  );
};

export default FarmerProfile;

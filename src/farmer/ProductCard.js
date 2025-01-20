import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red, grey, green } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { Box, Button, alpha } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ProductModal from './ProductModal';

// Styled ExpandMore Component (unused in this snippet but kept for potential future use)
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: 'auto',
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ProductCard({ product }) {
  const [token, setToken] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  console.log(product);

  const handleClickOpen = (product) => {
    setOpenDialog(true);
    setSelectedProduct(product);
  };

  const handleClose = () => {
    setOpenDialog(false);
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

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleDeleteClick = async() =>{
    console.log(product);
    const prodId = selectedProduct.prod_id;
    try {
     
      const response = await fetch(`http://localhost:5456/farmers/product?id=${prodId}`, {
          method: 'DELETE',
          headers: {
              Authorization: `Bearer ${token}`,
          }
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
          throw new Error(responseData.message || 'Failed to Delete product');
      }
      window.location.reload();
  
      alert('Product Deleted successfully!');
  } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete Product. Please try again.');
  }
  }

  const getImageUrl = (imageName) => {
    
    const urlimg =  `http://localhost:5456${imageName}`;
    console.log(urlimg);
    return urlimg;
  };

  const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <Card
      sx={{
        width: 345,
        margin: '16px auto',
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500], width: 40, height: 40, fontSize: '1rem' }} aria-label="product">
            {product.prod_Name[0].toUpperCase()}
          </Avatar>
        }
       
        title={product.prod_Name}
        subheader={product.category}
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
        subheaderTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
      />
      <CardMedia
        component="img"
        height="200"
        image={getImageUrl(product.prod_Img)}
        alt={product.prod_Name}
        sx={{
          objectFit: 'cover',
        }}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {truncateText(product.prod_Description, 100)}
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{
        padding: '16px',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Box sx={{
          display: 'flex',
          gap: '10px',
        }}>
          <Button 
            variant='outlined' 
            color='success' 
            onClick={() => handleEditClick(product)}
            sx={{
              borderColor: green[500],
              color: green[500],
              '&:hover': {
                borderColor: green[700],
                backgroundColor: alpha(green[500], 0.08),
              }
            }}
          >
            Edit
          </Button>

          <Button 
        variant='outlined' 
        color='error'
        sx={{
          borderColor: red[500],
          color: red[500],
          '&:hover': {
            borderColor: red[700],
            backgroundColor: alpha(red[500], 0.08),
          }
        }}
        onClick={() => {handleClickOpen(product)}}
      >
        Delete
      </Button>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDeleteClick} autoFocus color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
        </Box>

        <ProductModal
          
          open={open}
          onClose={() => setOpen(false)}
          productData={selectedProduct}
        />
      </CardActions>
    </Card>
  );
}
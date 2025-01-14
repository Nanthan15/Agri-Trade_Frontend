import React, { useState , useEffect } from 'react';
import { Card, Box, Modal, Typography, TextField, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const AddNewProductCard = () => {
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [category, setCategory] = useState('');
  const [productImg, setProductImg] = useState(null);
  const [productStock, setProductStock] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [listingDate, setListingDate] = useState('');
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
          const savedToken = localStorage.getItem('authToken');
          if (savedToken) {
              setToken(savedToken);
          } else {
              alert('No token found. Please log in first.');
              navigate('/login');
          }
      }, [navigate]);

  const handleImageUpload = (e) => {
    setProductImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
        alert('No token found. Please log in first.');
        return;
    }

    if (!productImg) {
        alert('Please upload an image.');
        return;
    }

    const formData = new FormData();
    const productData = {
        prod_Name: productName,
        prod_Description: productDescription,
        category,
        prod_Stock: productStock,
        prod_Quantity: productQuantity,
        prod_Price: productPrice,
        listing_Date: listingDate,
    };

    formData.append('products', JSON.stringify(productData));
    formData.append('prodImage', productImg);

    try {
        const response = await fetch('http://localhost:5456/farmers/product', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to add product');
        }

        alert('Product added successfully!');
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Failed to add product. Please try again.');
    }
};

  return (
    <>
      {/* Add New Product Card */}
      <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align to start for better control
    width: '40px', // Half of 80px for semi-circle
    height: '80px',
    borderRadius: '50px 0 0 50px',
    backgroundColor: 'lightgreen',
    position: 'relative',
    overflow: 'hidden',
    transition: 'width 0.3s ease',
    '&:hover': {
      width: '200px',
      '&::before': {
        content: '"Add Product"',
        position: 'absolute',
        left: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'green',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
      },
    },
    cursor: 'pointer',
  }}
  onClick={() => setOpen(true)}
>
  <AddIcon sx={{
    color: 'green',
    fontSize: '40px',
    position: 'absolute',
    right: '1px',
    zIndex: 1,
  }} />
</Box>

      {/* Modal for Adding Product */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>
            Add New Product
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Product Name"
              variant="outlined"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Product Description"
              variant="outlined"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Category"
              variant="outlined"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mb: 2 }}
            >
              Upload Image
              <input type="file" hidden onChange={handleImageUpload} />
            </Button>
            <TextField
              fullWidth
              type="number"
              label="Stock"
              variant="outlined"
              value={productStock}
              onChange={(e) => setProductStock(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              type="number"
              label="Quantity"
              variant="outlined"
              value={productQuantity}
              onChange={(e) => setProductQuantity(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              type="number"
              label="Price"
              variant="outlined"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              type="date"
              label="Listing Date"
              variant="outlined"
              value={listingDate}
              onChange={(e) => setListingDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Add Product
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default AddNewProductCard;

import React from 'react';
import NavBar from './compo/nav';
import { img1, img2, img3, img4 } from '../resource';
import '../styles/global.css';

function Home() {
  const allProducts = [
    { prod_id: 1, prod_Img: img1, prod_Name: 'Product 1', prod_Description: 'Description 1', prod_Price: '$10' },
    { prod_id: 2, prod_Img: img2, prod_Name: 'Product 2', prod_Description: 'Description 2', prod_Price: '$20' },
    { prod_id: 3, prod_Img: img3, prod_Name: 'Product 3', prod_Description: 'Description 3', prod_Price: '$30' },
  ];

  const getImageUrl = (img) => img;

  return (
    <>
      <NavBar/>
      <div id="carouselExampleCaptions" className="carousel slide" style={{ height: '525px' }}>
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner" style={{ height: '100%' }}>
          <div className="carousel-item active" style={{ height: '100%' }}>
            <img src={"https://media.istockphoto.com/id/990892396/photo/indian-farmer-holding-crop-plant-in-his-wheat-field.jpg?s=612x612&w=0&k=20&c=je5zLlBPEeFplzaSAg_hLryRy2r9AiajSBV_2dd3u_A="} className="d-block w-100" alt="First slide" style={{ height: '100%', objectFit: 'cover' }}/>
          </div>
          <div className="carousel-item" style={{ height: '100%' }}>
            <img src={img1} className="d-block w-100" alt="Second slide" style={{ height: '100%', objectFit: 'cover' }}/>
          </div>
          <div className="carousel-item" style={{ height: '100%' }}>
            <img src={img3} className="d-block w-100" alt="Third slide" style={{ height: '100%', objectFit: 'cover' }}/>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      <div className="container mt-4">
        <div className="row align-items-center mb-5">
          <div className="col-md-6">
            <img src={img2} alt="Project Image" className="img-fluid" style={{width:'600px'}}/>
          </div>
          <div className="col-md-6" style={{ backgroundColor: 'lightgreen', padding: '20px' }}>
            <h2><b>Welcome to AGRI&TRADE Company</b></h2>
            <p>We Provide for Health High Quality Food in Service 5 Years.</p>
            <p>Lorem ipsum dolor sit amet elit, consectetur adipiscing, sed eiusmod tempor sit amet elit dolor sit amet elit. Lorem ipsum dolor sit amet elit, consectetur adipiscing, sed eiusmod tempor sit amet elit.</p>
            <h4>Natural Food</h4>
            <p>Lorem ipsum dolor sit amet elit, consectetur adipiscing, sed eiusmod tempor sit amet elit.</p>
            <h4>High Quality Food</h4>
            <p>Lorem ipsum dolor sit amet elit, consectetur adipiscing, sed eiusmod tempor sit amet elit.</p>
            <button className="btn btn-primary">Learn More</button>
          </div>
        </div>
        <b><hr></hr></b>

        <h2 className="heading11 text-center mb-4">Your Role</h2>
        <div className="row">
          <div className="col-md-6">
            <div className="card role-card">
              <img src={img1} className="card-img-top" alt="Farmer" />
              <div className="card-body">
                <h5 className="card-title">Farmer</h5>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card role-card">
              <img src={img4} className="card-img-top" alt="Consumer" />
              <div className="card-body">
                <h5 className="card-title">Consumer</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 p-3" style={{ backgroundColor: 'lightgreen', width: '100vw', marginLeft: '-50vw', left: '50%', position: 'relative' }}>
          <h2 className="heading11">All Products</h2>
          <div className="row">
            {allProducts.map((prod) => (
              <div key={prod.prod_id} className="col-md-4 mb-3">
                <div className="card product-card">
                  <img src={getImageUrl(prod.prod_Img)} alt={prod.prod_Name} className="card-img-top"/>
                  <div className="card-body">
                    <h5 className="card-title">{prod.prod_Name}</h5>
                    <p className="card-text">{prod.prod_Description}</p>
                    <p className="card-text"><strong>Price:</strong> {prod.prod_Price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          
        </div>
        <footer className="text-center footer mt-5">
          
          <h4>About AgriTrade</h4>
          <p>AgriTrade is a leading company in providing high-quality agricultural products and services. With over 5 years of experience, we are committed to delivering the best to our customers.</p>
          <p><b>Contact Us:</b></p>
          <p>Address: 123 AgriTrade Street, Agriculture City, AG 45678</p>
          <p>Phone: +1 (123) 456-7890</p>
          <p>Email: info@agritrade.com</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <p><b>© 2023 AGRI&TRADE Company. All rights reserved.</b></p>
        </footer>
      </div>



      <br></br>
     
    </>
    
  );
}

export default Home;
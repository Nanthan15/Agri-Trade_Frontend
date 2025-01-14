import axios from 'axios';

// Function to handle user logi
const loginUser = async (username, password) => {
  try {
    // Send POST request to backend login API
    const response = await axios.post('http://localhost:5456/login', {
      username,
      password
    });

    // Check if response contains token
    if (response && response.data) {
      const token = response.data; // Assuming token is in response.data directly
      console.log("Token received:", token); // Log token for verification

      // Store token in localStorage (or sessionStorage if you prefer)
      localStorage.setItem('authToken', token); // Save the token to localStorage

      // Return the token or handle as needed
      return token;
    } else {
      throw new Error("Login failed: Token not found in response");
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw error; // Rethrow the error to be handled by component
  }
};

export default {
  loginUser
};

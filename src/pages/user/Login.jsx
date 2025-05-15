import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../../redux/features/auth/authAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/features/auth/authSlice';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginuser, { isLoading: loginLoading }] = useLoginUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { email, password };
  
    try {
      // Call API mutation
      const response = await loginuser(data).unwrap();
      
      console.log("API Response:", response); // Check the complete response structure
      
      // Destructure the necessary fields from the API response
      const { token, username, email, role, id } = response;
  
      // Ensure required data exists in the response
      if (!token || !username || !email || !role || !id) {
        toast.error("Required data is missing in the response.");
        return;
      }
  
      // Create a user object
      const user = {
        id,
        username,
        email,
        role
      };
  
      // Store user and token in Redux
      dispatch(setUser({ user, token }));
  
      // Store token in localStorage (for authentication purposes)
      localStorage.setItem("token", token);
      
      // Store user information in localStorage
      localStorage.setItem("user", JSON.stringify(user));
  
      // Show success toast
      toast.success("Login Successful!");
  
      // Navigate to home/dashboard
      navigate('/');
  
    } catch (error) {
      console.error("Login error:", error); // Log the error for debugging
      toast.error("Login failed. Please try again.");
    }
  };
  
  return (
    <div className='max-w-sm bg-white mx-auto p-8 m-36'>
      <h2 className='text-2xl font-semibold pt-5'>Accesible only to admin</h2>

      <form onSubmit={handleLogin} className='space-y-5 max-w-sm mx-auto pt-8'>
        <input
          type='email'
          value={email}
          placeholder='Enter your email'
          required
          onChange={(e) => setEmail(e.target.value)}
          className='w-full bg-bgPrimary focus:outline-none px-5 py-3'
        />
        <input
          type='password'
          value={password}
          placeholder='Password'
          required
          onChange={(e) => setPassword(e.target.value)}
          className='w-full bg-bgPrimary focus:outline-none px-5 py-3'
        />

        <button
          disabled={loginLoading}
          className='w-full mt-5 bg-primary hover:bg-indigo-500 text-white font-medium py-3 rounded md'
        >
          Log In
        </button>
      </form>

     
      <ToastContainer />
    </div>
  );
};

export default Login;

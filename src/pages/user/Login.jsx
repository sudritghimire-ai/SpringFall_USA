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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-4 py-8 font-mono">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-2xl p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            {/* Gravity Calligraphy Logo */}
            <div className="mb-6">
              <svg 
                width="120" 
                height="50" 
                viewBox="0 0 120 50" 
                className="mx-auto"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Calligraphy-style "Gravity" */}
                <path 
                  d="M8 35C8 35 12 20 18 20C24 20 26 28 26 32C26 36 24 40 20 40C16 40 14 36 14 32C14 28 16 24 20 24C24 24 28 28 28 32" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  fill="none"
                />
                <path 
                  d="M32 25L32 40M32 25C32 25 36 20 40 25C44 30 40 35 36 35C32 35 32 30 32 25Z" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  fill="none"
                />
                <path 
                  d="M46 25L46 40M46 25C46 25 50 20 54 25L54 40" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  fill="none"
                />
                <path 
                  d="M58 25L58 40M58 25L66 40M66 25L66 40" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  fill="none"
                />
                <path 
                  d="M70 40L70 25M70 40C70 40 74 35 78 40M78 25L78 40" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  fill="none"
                />
                <path 
                  d="M82 25L82 35C82 38 84 40 87 40C90 40 92 38 92 35L92 25M82 32L92 32" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  fill="none"
                />
                <path 
                  d="M96 25L96 40M96 25C96 25 100 20 104 25L100 32.5L108 40" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  fill="none"
                />
                
                {/* Elegant underline flourish */}
                <path 
                  d="M15 45C25 43 35 43 45 45C55 47 65 47 75 45C85 43 95 43 105 45" 
                  stroke="white" 
                  strokeWidth="1" 
                  strokeLinecap="round" 
                  fill="none" 
                  opacity="0.6"
                />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Admin Portal
            </h1>
            <p className="text-gray-400 text-sm font-medium">
              Restricted Access
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                placeholder="admin@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all duration-200"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                placeholder="••••••••"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all duration-200"
              />
            </div>

            {/* Login Button */}
            <button
              disabled={loginLoading}
              className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-600 text-black disabled:text-gray-400 font-semibold py-3 px-6 rounded-md transition-all duration-200 mt-6 disabled:cursor-not-allowed"
            >
              {loginLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <div className="text-center">
              {/* Gravity Developer Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800/50 border border-gray-700 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-gray-300 font-medium tracking-wide">
                  GRAVITY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle accent elements */}
        <div className="absolute -top-2 -left-2 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Login;

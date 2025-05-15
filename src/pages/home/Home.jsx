import React from 'react';
import Hero from './Hero';
import Blogs from '../blogs/Blogs';
import Navbar from "./components/Navbar";

const Home = () => {
  return (
    <>
      {/* Main Content */}
      <div className='bg-white-400 text-pr container mx-auto mt-8 p-8'>
        <Hero />

        <Blogs />
      </div>

      {/* Premium Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        {/* Top Wave Divider */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
          </svg>
        </div>
        
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 pt-16 pb-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {/* Brand */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">SpringFallUSA</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Sharing knowledge and stories that inspire. Join our community of curious minds.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="https://www.facebook.com/groups/3600099270261022/" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-500 flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                
                <a href="https://www.instagram.com/springfall_07?igsh=MXhxMmZmMXl4aWppeA==" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-500 flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div className="md:mx-auto">
              <h3 className="text-lg font-bold mb-6 relative inline-block">
                Quick Links
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></span>
              </h3>
              <ul className="space-y-4">
                <li>
                  <a href="/" className="group flex items-center text-gray-300 hover:text-white transition-colors duration-300">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                    <span>Home</span>
                  </a>
                </li>
                <li>
                  <a href="/privacy-policy" className="group flex items-center text-gray-300 hover:text-white transition-colors duration-300">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                    <span>Privacy And Policy</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-6 relative inline-block">
                Contact Us
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email:</p>
                    <a href="mailto:support@springfallus.org" className="text-white hover:text-blue-400 transition-colors duration-300">support@springfallus.org</a>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone:</p>
                    <a href="tel:+9779819186578" className="text-white hover:text-blue-400 transition-colors duration-300">+(977) 9819186578</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative border-t border-gray-800 py-6">
          <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} <span className="text-blue-400 font-medium">SpringFallUSA</span>. All rights reserved.
            </div>
            <div className="flex space-x-6">
             
              
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
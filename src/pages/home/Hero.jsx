import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import Img1 from "../../assets/images/logo.jpeg";
import Img2 from "../../assets/images/img1.jpeg";
import Img3 from "../../assets/images/img3.jpeg";
import Img4 from "../../assets/images/img2.jpeg";
import { FaCheckCircle } from 'react-icons/fa';

export const Hero = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center md:gap-14 gap-8 py-16 px-5 bg-gradient-to-br from-white via-blue-50 to-blue-100 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 rounded-full filter blur-3xl opacity-20 translate-x-1/3 translate-y-1/3"></div>
      
      {/* Text Section */}
      <div className="md:w-1/2 w-full text-center md:text-left z-10">
        <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4 animate-pulse">
          Your Path to Success
        </div>
        <h1 className="md:text-6xl text-4xl font-extrabold text-gray-800 mb-6 tracking-wide leading-tight">
          <span className="text-blue-600 font-serif bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Application</span>
          <span className="text-gray-800 text-2xl md:text-3xl"> to </span>
          <span className="text-blue-600 font-serif bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Admission</span>,
          <span className="text-gray-800 text-2xl md:text-3xl block mt-2"> We've Got You Covered</span>
        </h1>

        <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-xl">
          Applying to U.S. universities can feel overwhelming, but we make it simple. 
          From choosing the right schools to preparing your documents and acing your visa interview, 
          we guide you every step of the way.
        </p>
        <div className="flex flex-col gap-5 items-center md:items-start mb-8">
          <div className="flex items-center group transition-all duration-300 hover:translate-x-2">
            <FaCheckCircle className="text-blue-500 mr-3 text-xl" />
            <span className="text-gray-800 text-lg font-medium group-hover:text-blue-600 transition-colors">Know everything about your dream university</span>
          </div>
          <div className="flex items-center group transition-all duration-300 hover:translate-x-2">
            <FaCheckCircle className="text-blue-500 mr-3 text-xl" />
            <span className="text-gray-800 text-lg font-medium group-hover:text-blue-600 transition-colors">Be ready for your visa interview, no stress</span>
          </div>
          <div className="flex items-center group transition-all duration-300 hover:translate-x-2">
            <FaCheckCircle className="text-blue-500 mr-3 text-xl" />
            <span className="text-gray-800 text-lg font-medium group-hover:text-blue-600 transition-colors">Get help from students who've done it before</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
         
        </div>
      </div>

      {/* Image Slider Section */}
      <div className="md:w-1/2 w-full mx-auto z-10">
        <div className="relative">
          {/* Decorative elements for slider */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-300 rounded-full opacity-20 z-0"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-400 rounded-full opacity-20 z-0"></div>
          
          <Swiper
            slidesPerView={1} 
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 1500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 1, spaceBetween: 40 },
              1024: { slidesPerView: 1, spaceBetween: 50 },
            }}
            modules={[Pagination, Autoplay]}
            className="mySwiper"
          >
            {[Img1, Img2, Img3, Img4].map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="overflow-hidden rounded-2xl border-2 border-blue-100 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(59,130,246,0.5)] p-2 bg-white">
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`Image ${idx + 1}`}
                    className="w-full lg:h-[420px] sm:h-96 h-80 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Stats or social proof */}
          <div className="absolute -bottom-6 -left-6 bg-white px-4 py-2 rounded-lg shadow-lg z-20 hidden md:flex items-center space-x-2">
            <div className="bg-blue-500 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Trusted by</p>
              <p className="text-sm font-bold text-gray-800">30000+ Students</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
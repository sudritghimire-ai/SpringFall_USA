import React from 'react';

export const About = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="max-w-4xl w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Our Story</h1>
        <p className="text-lg text-gray-700 mb-4">
          We get it. The F-1 visa process is a rollercoaster of stress, confusion, and occasional tears (trust us, we've been there). 😩
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Spring/Fall USA was founded by a group of former international students who know exactly how hard it can be to navigate the system. From the endless paperwork to the never-ending wait, we understand the struggle. 😓
        </p>
        <p className="text-lg text-gray-700 mb-6">
          But guess what? You're not alone. We've got your back. We’ve survived the chaos, and now we’re here to help you avoid the same headaches. So sit back, relax, and let’s make your journey to the U.S. a little bit smoother. 🌎✈️
        </p>
      </div>
    </div>
  );
};

export default About;

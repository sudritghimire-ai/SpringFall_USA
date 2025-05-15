import React from 'react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-8">
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-6">Contact Us</h1>
        <p className="text-xl text-gray-800 leading-relaxed mb-4">
          We would love to hear from you! Please feel free to reach out with any questions, feedback, or comments. We'll get back to you as soon as possible.
        </p>

        {/* Placeholder for your form */}
        <div className="text-center text-lg font-semibold text-gray-700 mb-4">
          Add your contact form here later.
        </div>

        <div className="text-center text-lg text-blue-500">
          <p>Join our community on Telegram for discussions on F1 and mock preparations:</p>
          <a href="https://t.me/SpringfallUSA" target="_blank" rel="noopener noreferrer" className="underline">
            Spring/Fall USA (Mock Perp. and F1 Discussion)
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

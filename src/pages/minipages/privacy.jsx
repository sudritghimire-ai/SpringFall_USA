import React from 'react';

export const Privacy = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="max-w-3xl w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Disclaimer
        </h1>
        <p className="text-lg text-gray-700">
          The university-related information provided on this website — including details about scholarships, donations, admissions, and campus life — is intended purely for educational and informational purposes.
          <br /><br />
          We are not officially affiliated with any university, college, or academic institution mentioned. All content is compiled from publicly available sources to help prospective students, parents, and educators.
          <br /><br />
          If any university believes that published content on this site violates their policy, intellectual property, or branding guidelines, please contact us. We will promptly review and remove the content if needed.
          <br /><br />
          📧 For university-related concerns only, contact us at: <strong>support@springfallus.org</strong>
        </p>
      </div>
    </div>
  );
};

export default Privacy;

import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md my-10">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        Welcome to our website. We post university-related blogs written in our own words,
        sometimes summarizing or referencing content from various sources on the internet. We
        always strive to get permission from students when using their work or contributions.
      </p>

      <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
      <p className="mb-4">
        We do not collect any personal information from visitors unless voluntarily submitted
        through contact forms or other interactive features.
      </p>

      <h2 className="text-2xl font-semibold mb-3">Use of Information</h2>
      <p className="mb-4">
        Any information you provide is used solely to respond to your inquiries or requests. We
        do not share or sell your information to third parties.
      </p>

      <h2 className="text-2xl font-semibold mb-3">Content Ownership</h2>
      <p className="mb-4">
        The blogs published on this website are written primarily in our own words. When we use
        content from other platforms or sources, we ensure proper permission has been obtained,
        especially from students who contribute their work.
      </p>

      <h2 className="text-2xl font-semibold mb-3">Complaints and Queries</h2>
      <p className="mb-4">
        If you have any complaints regarding content published on this website or have questions
        about our policies, please contact{" "}
        <a
          href="https://springfallus.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          springfallus.org
        </a>
        . We take all concerns seriously and will address them promptly.
      </p>

      <h2 className="text-2xl font-semibold mb-3">Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Any changes will be posted on this
        page with an updated revision date.
      </p>

      <p className="text-gray-600 text-sm mt-8">
        Last updated: July 2025
      </p>
    </div>
  );
};

export default PrivacyPolicy;

import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto my-16 p-10 bg-white rounded-3xl shadow-xl ring-1 ring-gray-200">
      <h1 className="text-4xl font-extrabold mb-8 text-indigo-700 tracking-wide font-serif">
        Privacy Policy
      </h1>

      <section className="mb-8">
        <p className="text-lg text-gray-700 leading-relaxed">
          Welcome to our website. We post university-related blogs written in our own words,
          sometimes summarizing or referencing content from various sources on the internet. We
          always strive to get permission from students when using their work or contributions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-l-4 border-indigo-500 pl-4 text-indigo-700 font-serif">
          Information We Collect
        </h2>
        <p className="text-gray-700 leading-relaxed">
          We do not collect any personal information from visitors unless voluntarily submitted
          through contact forms or other interactive features.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-l-4 border-indigo-500 pl-4 text-indigo-700 font-serif">
          Use of Information
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Any information you provide is used solely to respond to your inquiries or requests. We
          do not share or sell your information to third parties.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-l-4 border-indigo-500 pl-4 text-indigo-700 font-serif">
          Content Ownership
        </h2>
        <p className="text-gray-700 leading-relaxed">
          The blogs published on this website are written primarily in our own words. When we use
          content from other platforms or sources, we ensure proper permission has been obtained,
          especially from students who contribute their work.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-l-4 border-indigo-500 pl-4 text-indigo-700 font-serif">
          Complaints and Queries
        </h2>
        <p className="text-gray-700 leading-relaxed">
          If you have any complaints regarding content published on this website or have questions
          about our policies, please contact{" "}
          <a
            href="https://springfallus.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 underline font-semibold"
          >
            springfallus.org
          </a>
          . We take all concerns seriously and will address them promptly.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 border-l-4 border-indigo-500 pl-4 text-indigo-700 font-serif">
          Changes to This Policy
        </h2>
        <p className="text-gray-700 leading-relaxed">
          We may update this Privacy Policy from time to time. Any changes will be posted on this
          page with an updated revision date.
        </p>
      </section>

      <p className="mt-12 text-sm text-gray-500 text-center italic">
        Last updated: July 2025
      </p>
    </div>
  );
};

export default PrivacyPolicy;

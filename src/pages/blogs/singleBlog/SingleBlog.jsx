import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchBlogByIdQuery } from '../../../redux/features/blogs/blogsApi';
import SingleBlogCard from './SingleBlogCard';
import CommentCards from '../../comments/CommentCards';
import RelatedBlogs from './RelatedBlogs';

// Table of Contents Component
const TableOfContents = ({ blog }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Generate TOC items based on your blog structure
  const tocItems = blog ? [
    { id: 'quick-facts', title: 'Quick Facts', level: 1, icon: '📌' },
    { id: 'deadlines', title: 'Deadlines', level: 1, icon: '📅' },
    { id: 'requirements', title: 'Requirements', level: 1, icon: '📋' },
    { id: 'documents', title: 'Documents', level: 1, icon: '📄' },
    { id: 'expenses', title: 'Expenses', level: 1, icon: '💰' },
    { id: 'insurance', title: 'Insurance Fees', level: 1, icon: '🏥' },
    { id: 'scholarships', title: 'Scholarships', level: 1, icon: '🎓' },
    { id: 'climate', title: 'Climate', level: 1, icon: '🌤️' },
    { id: 'housing', title: 'Housing', level: 1, icon: '🏠' }
  ] : [];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Mobile Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 text-left font-semibold text-gray-900 flex justify-between items-center hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <span>Table of Contents</span>
          </div>
          <svg
            className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* TOC Header for Desktop */}
      <div className="hidden lg:block p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📚</span>
          <h3 className="font-semibold text-gray-900">Table of Contents</h3>
        </div>
        <div className="mt-2 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"></div>
      </div>

      {/* TOC Content */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        {tocItems.length > 0 ? (
          <nav className="p-4 space-y-1">
            {tocItems.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {item.title}
                </span>
              </button>
            ))}
          </nav>
        ) : (
          <div className="p-4 text-center text-gray-500">
            <span className="text-4xl mb-2 block">📖</span>
            <p className="text-sm">Content sections will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Related Institutions Component
const RelatedInstitutions = ({ blog }) => {
  // Check for real institution data - adjust these paths based on your actual data structure
  const institutions = blog?.relatedInstitutions || blog?.institutions || [];
  
  // Only render if there are actual institutions
  if (!institutions || institutions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏛️</span>
          <h3 className="font-semibold text-gray-900">Related Institutions</h3>
        </div>
        <div className="mt-2 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
      </div>
      
      <div className="p-4 space-y-4">
        {institutions.slice(0, 5).map((institution, index) => (
          <div key={institution.id || index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🎓</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm truncate">
                {institution.name}
              </h4>
              <p className="text-gray-600 text-xs mt-1">
                {institution.type || 'Institution'}
              </p>
              {institution.location && (
                <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                  <span>📍</span>
                  {institution.location}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Related Articles Component
const RelatedArticlesSection = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📰</span>
          <h3 className="font-semibold text-gray-900">Related Articles</h3>
        </div>
        <div className="mt-2 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
      </div>
      <div className="p-4">
        <RelatedBlogs />
      </div>
    </div>
  );
};

const SingleBlog = () => {
  const { id } = useParams();
  const { data: blog, error, isLoading } = useFetchBlogByIdQuery(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto pt-24 md:pt-20 px-4">
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading blog post...</h2>
              <p className="text-gray-500">Please wait while we fetch the content</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto pt-24 md:pt-20 px-4">
          <div className="text-center py-32">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">We couldn't load the blog post. Please try again later.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!blog?.post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto pt-24 md:pt-20 px-4">
          <div className="text-center py-32">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog post not found</h2>
            <p className="text-gray-600">The requested blog post could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have real institution data
  const hasInstitutions = blog.post?.relatedInstitutions?.length > 0 || blog.post?.institutions?.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto pt-24 md:pt-20 px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-12">
          {/* Table of Contents - Left Sidebar */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="sticky top-24">
              <TableOfContents blog={blog.post} />
            </div>
          </div>

          {/* Main Blog Content */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              <SingleBlogCard blog={blog.post} />
            </div>
            
            {/* Comments Section */}
            <div id="comments" className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <h3 className="font-semibold text-gray-900">Comments</h3>
                </div>
                <div className="mt-2 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
              </div>
              <div className="p-4">
                <CommentCards />
              </div>
            </div>
          </div>

          {/* Right Sidebar - Show either Related Institutions OR Related Articles */}
          <div className="lg:col-span-3 order-3">
            <div className="sticky top-24 space-y-6">
              {hasInstitutions ? (
                <RelatedInstitutions blog={blog.post} />
              ) : (
                <RelatedArticlesSection />
              )}
              
              {/* If we have institutions, show a smaller related articles section below */}
              {hasInstitutions && (
                <RelatedArticlesSection />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchBlogByIdQuery } from '../../../redux/features/blogs/blogsApi';
import SingleBlogCard from './SingleBlogCard';
import CommentCards from '../../comments/CommentCards';
import RelatedBlogs from './RelatedBlogs';

// Table of Contents Component
const TableOfContents = ({ blog }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Generate TOC items - you can customize this based on your blog structure
  const tocItems = blog ? [
    { id: 'overview', title: 'Overview', level: 1 },
    { id: 'content', title: 'Main Content', level: 1 },
    { id: 'key-points', title: 'Key Points', level: 2 },
    { id: 'conclusion', title: 'Conclusion', level: 1 },
    { id: 'comments', title: 'Comments', level: 1 }
  ] : [];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border sticky top-24">
      {/* Mobile Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 text-left font-semibold text-gray-900 flex justify-between items-center"
        >
          Table of Contents
          <svg
            className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* TOC Content */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block p-4`}>
        <h3 className="hidden lg:block font-semibold text-gray-900 mb-4">Table of Contents</h3>
        
        {tocItems.length > 0 ? (
          <nav className="space-y-2">
            {tocItems.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left text-sm hover:text-blue-600 transition-colors py-1 ${
                  item.level === 1 
                    ? 'font-medium text-gray-900' 
                    : 'ml-4 text-gray-600'
                }`}
              >
                {item.title}
              </button>
            ))}
          </nav>
        ) : (
          <div className="text-gray-500 text-sm space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        )}
      </div>
    </div>
  );
};

// Related Institutions Component
const RelatedInstitutions = ({ blog }) => {
  // Mock data structure - replace with actual data from your blog object
  const institutions = blog?.relatedInstitutions || blog?.institutions || [];
  
  // Fallback placeholder institutions if none exist
  const placeholderInstitutions = institutions.length === 0 ? [
    { name: 'Loading...', type: 'Institution', id: 1 },
    { name: 'Loading...', type: 'Organization', id: 2 },
    { name: 'Loading...', type: 'University', id: 3 }
  ] : institutions;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-24">
      <h3 className="font-semibold text-gray-900 mb-4">Related Institutions</h3>
      
      <div className="space-y-3">
        {placeholderInstitutions.slice(0, 5).map((institution, index) => (
          <div key={institution.id || index} className="border-b border-gray-100 pb-3 last:border-b-0">
            <h4 className="font-medium text-gray-900 text-sm">
              {institution.name || 'Institution Name'}
            </h4>
            <p className="text-gray-600 text-xs mt-1">
              {institution.type || 'Type'}
            </p>
            {institution.location && (
              <p className="text-gray-500 text-xs">{institution.location}</p>
            )}
          </div>
        ))}
      </div>

      {institutions.length === 0 && (
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs">No related institutions available</p>
        </div>
      )}
    </div>
  );
};

const SingleBlog = () => {
  const { id } = useParams();
  const { data: blog, error, isLoading } = useFetchBlogByIdQuery(id);

  if (isLoading) {
    return (
      <div className="text-primary container mx-auto mt-24 md:mt-20 px-4">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-blue-800 text-lg">Loading blog post...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-primary container mx-auto mt-24 md:mt-20 px-4">
        <div className="text-red-600 text-center py-20">
          <h2 className="text-xl font-semibold mb-2">Something went wrong...</h2>
          <p>Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  if (!blog?.post) {
    return (
      <div className="text-primary container mx-auto mt-24 md:mt-20 px-4">
        <div className="text-gray-600 text-center py-20">
          <h2 className="text-xl font-semibold mb-2">Blog post not found</h2>
          <p>The requested blog post could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-primary container mx-auto mt-24 md:mt-20 px-4 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Table of Contents - Left Sidebar */}
        <div className="lg:col-span-3 xl:col-span-2 order-2 lg:order-1">
          <TableOfContents blog={blog.post} />
        </div>

        {/* Main Blog Content */}
        <div className="lg:col-span-6 xl:col-span-7 order-1 lg:order-2">
          <div id="overview">
            <SingleBlogCard blog={blog.post} />
          </div>
          
          {/* Comments Section */}
          <div id="comments" className="mt-8">
            <CommentCards />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-3 order-3 space-y-6">
          {/* Related Institutions */}
          <RelatedInstitutions blog={blog.post} />
          
          {/* Related Blogs */}
          <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Related Articles</h3>
            <RelatedBlogs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;

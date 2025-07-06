import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchBlogByIdQuery } from '../../../redux/features/blogs/blogsApi';
import SingleBlogCard from './SingleBlogCard';
import CommentCards from '../../comments/CommentCards';
import RelatedBlogs from './RelatedBlogs';
import RelatedInstitutions from './RelatedInstitutions';

const SingleBlog = () => {
  const { id } = useParams();
  const { data: blog, error, isLoading } = useFetchBlogByIdQuery(id);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [tocItems, setTocItems] = useState([]);
  const [activeSection, setActiveSection] = useState('');

  // Generate TOC from blog content
  useEffect(() => {
    if (blog?.post?.content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(blog.post.content, 'text/html');
      const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      const items = Array.from(headings).map((heading, index) => ({
        id: `heading-${index}`,
        text: heading.textContent,
        level: parseInt(heading.tagName.charAt(1)),
        element: heading
      }));
      
      setTocItems(items);
    }
  }, [blog?.post?.content]);

  // Handle scroll spy for active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (let i = tocItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(tocItems[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tocItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileTocOpen(false); // Close mobile TOC after click
    }
  };

  // Determine which related content to show
  const getRelatedContent = () => {
    // Check if related institutions exist and have content
    if (blog?.post?.relatedInstitutions && blog.post.relatedInstitutions.length > 0) {
      return <RelatedInstitutions institutions={blog.post.relatedInstitutions} />;
    }
    // Otherwise show related articles
    return <RelatedBlogs />;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto mt-24 md:mt-20 px-4">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-blue-800 text-lg">Loading blog post...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto mt-24 md:mt-20 px-4">
        <div className="text-red-600 text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Something went wrong...</h2>
          <p>Unable to load the blog post. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!blog?.post) {
    return (
      <div className="container mx-auto mt-24 md:mt-20 px-4">
        <div className="text-gray-600 text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Blog post not found</h2>
          <p>The requested blog post could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-primary container mx-auto mt-24 md:mt-20 px-4">
      {/* Mobile TOC Toggle Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform ${isMobileTocOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Table of Contents
        </button>
      </div>

      {/* Mobile TOC Dropdown */}
      {isMobileTocOpen && (
        <div className="lg:hidden mb-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <nav className="space-y-2">
            {tocItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{ paddingLeft: `${(item.level - 1) * 16 + 12}px` }}
              >
                {item.text}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main 3-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Column 1: Table of Contents (3/12) - Hidden on mobile */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 max-h-screen overflow-y-auto">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
              {tocItems.length > 0 ? (
                <nav className="space-y-2">
                  {tocItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                        activeSection === item.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              ) : (
                <p className="text-gray-500 text-sm">No headings found in this post.</p>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Main Blog Content & Comments (6/12) */}
        <div className="col-span-1 lg:col-span-6">
          <div className="space-y-8">
            {/* Blog Post */}
            <div className="bg-white rounded-lg shadow-sm">
              <SingleBlogCard blog={blog.post} />
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <CommentCards blogId={id} />
            </div>
          </div>
        </div>

        {/* Column 3: Related Content (3/12) - Either Institutions OR Articles */}
        <div className="col-span-1 lg:col-span-3">
          <div className="sticky top-24 max-h-screen overflow-y-auto">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              {getRelatedContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;

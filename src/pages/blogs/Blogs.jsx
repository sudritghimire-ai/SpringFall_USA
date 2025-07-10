import React, { useState } from 'react';
import SearchBlog from './SearchBlog';
import { Link } from 'react-router-dom';
import { useFetchBlogsQuery } from '../../redux/features/blogs/blogsApi';

const Blogs = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState({ search: '', category: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;

  const { data: blogs = [], error, isLoading } = useFetchBlogsQuery(query);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setQuery({ search: value, category });
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setQuery({ search, category });
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * blogsPerPage;
  const indexOfFirst = indexOfLast - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const getPagination = () => {
    const pages = [];
    const delta = 2;
    const range = (start, end) =>
      Array.from({ length: end - start + 1 }, (_, i) => start + i);
    if (totalPages <= 7) return range(1, totalPages);
    pages.push(1);
    if (currentPage > 4) pages.push('...');
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);
    pages.push(...range(start, end));
    if (currentPage < totalPages - 3) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="mt-16 container mx-auto px-4 sm:px-6 lg:px-8">
      <SearchBlog
        search={search}
        handleSearchChange={handleSearchChange}
        handleSearch={handleSearch}
      />

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-10 px-4 bg-red-50 rounded-xl border border-red-100 text-red-500 mt-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">{error.toString()}</p>
        </div>
      )}

      {!isLoading && !error && blogs.length > 0 && (
        <div className="flex justify-between items-center mb-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Latest Articles
            <span className="ml-2 text-sm font-normal text-gray-500">({blogs.length} posts)</span>
          </h2>
          <div className="hidden sm:block h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-grow mx-4"></div>
        </div>
      )}

      {!isLoading && !error && blogs.length === 0 && (
        <div className="text-center py-16 px-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
          <p className="text-gray-500 max-w-md mx-auto">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}

      <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-10 mb-16">
        {currentBlogs.map((blog) => (
          <Link
            to={`/blogs/${blog._id}`}
            key={blog._id}
            className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative"
          >
            <div className="relative overflow-hidden aspect-[16/9]">
              <img
                src={blog.coverImg || '/placeholder.svg?height=300&width=400'}
                alt={blog.title}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder.svg?height=300&width=400';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="flex flex-col flex-grow p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                {blog.title}
              </h2>
              <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                {blog.description || 'No description available.'}
              </p>
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                <span className="inline-flex items-center text-xs font-medium text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(blog.createdAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <span className="inline-flex items-center text-xs font-medium text-blue-600 group-hover:translate-x-1 transition-transform duration-300">
                  Read more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>

            {blog.category && (
              <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {blog.category}
              </div>
            )}
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 space-x-2">
          {getPagination().map((page, i) =>
            page === '...' ? (
              <span key={i} className="px-3 py-2 text-gray-400">...</span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 text-sm rounded ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-blue-100'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Blogs;

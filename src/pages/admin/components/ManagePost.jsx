import React, { useState } from 'react';
import { useDeleteBlogMutation, useFetchBlogsQuery } from '../../../redux/features/blogs/blogsApi';
import { formatDate } from '../../../utils/formatDate';
import { Link } from 'react-router-dom';
import { MdModeEdit, MdDelete, MdSearch } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux'; // Import useSelector to access the user data

const ManagePost = () => {
  const [query, setQuery] = useState({ search: '', category: '' });
  const { data: blogs = [], error, isLoading, refetch } = useFetchBlogsQuery(query);
  const [deleteBlog] = useDeleteBlogMutation();

  const { user } = useSelector((state) => state.auth); // Access the user from Redux store

  const handleDelete = async (id) => {
    try {
      const response = await deleteBlog(id).unwrap();
      toast.success(response.message || 'Blog deleted successfully!');
      refetch();
    } catch (error) {
      toast.error('Failed to delete blog.');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery((prev) => ({ ...prev, search: value }));
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">All University Blogs</h1>
          </div>

          {/* Search bar */}
          <div className="flex items-center bg-white shadow-sm rounded-md p-2 mb-4">
            <MdSearch className="text-gray-500 ml-2" />
            <input
              type="text"
              placeholder="Search blogs..."
              onChange={handleSearch}
              className="ml-2 w-full p-2 outline-none"
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-10 text-gray-500 text-lg">
              Loading...
            </div>
          )}

          {/* Table */}
          {!isLoading && (
            <div className="overflow-x-auto bg-white shadow rounded-md">
              <table className="w-full table-auto">
                <thead className="bg-gray-100 text-gray-600 text-sm uppercase text-left">
                  <tr>
                    <th className="py-3 px-6 border-r">No.</th>
                    <th className="py-3 px-6 border-r">Title</th>
                    <th className="py-3 px-6 border-r">Published</th>
                    <th className="py-3 px-6 border-r">Edit</th>
                    <th className="py-3 px-6">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.length > 0 ? (
                    blogs.map((blog, index) => (
                      <tr key={blog._id} className="border-b hover:bg-gray-50 transition">
                        <td className="py-3 px-6 border-r">{index + 1}</td> {/* Add border-right */}
                        <td className="py-3 px-6 border-r">{blog.title}</td> {/* Add border-right */}
                        <td className="py-3 px-6 border-r">{formatDate(blog.createdAt)}</td> {/* Add border-right */}

                        {/* Edit Button - Only for admin */}
                        <td className="py-3 px-6 border-r">
                          {user.role === 'admin' && (
                            <Link
                              to={`/dashboard/update-items/${blog._id}`}
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <MdModeEdit />
                              Edit
                            </Link>
                          )}
                        </td>

                        {/* Delete Button - Only for admin */}
                        <td className="py-3 px-6">
                          {user.role === 'admin' && (
                            <button
                              onClick={() => handleDelete(blog._id)}
                              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md flex items-center gap-1"
                            >
                              <MdDelete />
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-gray-500">
                        No blogs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-10 text-center text-sm text-gray-500">
            <a
              href="https://www.creative-tim.com/product/notus-js"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-blue-500"
            >
            </a>
            <a
              href="https://www.creative-tim.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-blue-500"
            >
            </a>
          </footer>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ManagePost;

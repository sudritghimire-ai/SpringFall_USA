import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RiAdminFill } from "react-icons/ri";
import { FaBlog } from "react-icons/fa";
import { useFetchBlogsQuery } from '../../redux/features/blogs/blogsApi';
import { useGetCommentsQuery } from '../../redux/features/comments/commentApi';
import { useGetUserQuery } from '../../redux/features/auth/authAPI';

const Dashboard = () => {
  const [query, setQuery] = useState({ search: '', category: '' });
  const { user } = useSelector((state) => state.auth);
  const { data: blogs = [], isLoading } = useFetchBlogsQuery(query);
  const { data: comments = {} } = useGetCommentsQuery();
  const { data: users = {}, error: usersError } = useGetUserQuery();

  const userArray = users?.users || [];
  const adminCounts = userArray.filter(user => user.role?.toLowerCase() === 'admin').length;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      {isLoading ? (
        <div className="text-center text-gray-600 py-10 text-lg">Loading dashboard...</div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Welcome Banner */}
          <div className="bg-white shadow-md rounded-xl p-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Hi, {user?.username} 👋</h1>
            <p className="text-gray-600 mt-2">Welcome to your clean and modern admin dashboard.</p>
            <p className="text-sm text-gray-400">Track your university's blogs, admins, and notifications all in one place.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-t-4 border-red-500 rounded-xl p-6 shadow hover:shadow-lg transition-all">
              <div className="flex items-center justify-center mb-4 text-red-500">
                <RiAdminFill className="text-5xl" />
              </div>
              <h3 className="text-center text-xl font-semibold">{adminCounts} Admin{adminCounts !== 1 ? 's' : ''}</h3>
              <p className="text-center text-gray-500 text-sm">Total platform admins</p>
            </div>

            <div className="bg-white border-t-4 border-yellow-500 rounded-xl p-6 shadow hover:shadow-lg transition-all">
              <div className="flex items-center justify-center mb-4 text-yellow-500">
                <FaBlog className="text-5xl" />
              </div>
              <h3 className="text-center text-xl font-semibold">{blogs.length} Blogs</h3>
              <p className="text-center text-gray-500 text-sm">Published university blogs</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

//well we wont be doing comment for now
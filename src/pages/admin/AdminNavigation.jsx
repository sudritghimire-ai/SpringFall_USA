import React from 'react';
import AdminImg from '../../assets/images/admin.png';
import { NavLink } from 'react-router-dom';
import { useLogoutUserMutation } from '../../redux/features/auth/authAPI';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/auth/authSlice';

const AdminNavigation = () => {
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className='bg-white border-r border-gray-200 shadow-md p-6 min-h-screen flex flex-col justify-between'>
      {/* Profile Section */}
      <div className='text-center mb-8'>
        <img
          src={AdminImg}
          alt='Admin'
          className='w-20 h-20 rounded-full mx-auto mb-3 border-4 border-gray-300 shadow-sm'
        />
        <p className='text-lg font-semibold text-gray-800'>Admin</p>
      </div>

      {/* Navigation Links */}
      <nav className='flex-1'>
        <ul className='space-y-4'>
          <li>
            <NavLink
              to='/dashboard'
              end
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/dashboard/add-new-post'
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`
              }
            >
              Add New Post
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/dashboard/manage-items'
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`
              }
            >
              Manage Post
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className='mt-6'>
        <button
          onClick={handleLogout}
          className='w-full bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-all'
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default AdminNavigation;

import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { CgMenuGridO } from "react-icons/cg";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch, useSelector } from 'react-redux';
import avatarImg from "../assets/images/avatar.png";
import { useLogoutUserMutation } from '../redux/features/auth/authAPI';
import { logout } from '../redux/features/auth/authSlice';

const navLists = [
    { name: "Home", path: '/' },
    { name: "Privacy and Policy", path: '/privacy-policy' },
    { name: "University Search", path: '/about-us' }
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const [logoutUser] = useLogoutUserMutation();
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logoutUser()
            .then(() => dispatch(logout()))
            .catch(console.error);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);
    const isFixedNavbar = location.pathname.includes('/blogs/');

    return (
        <header className={`bg-white py-4 font-sans w-full z-50 transition-all duration-500 ${scrolled ? 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]' : 'shadow-none'} ${isFixedNavbar ? 'fixed top-0 left-0 right-0' : ''}`}>
            <nav className='container mx-auto flex justify-between items-center px-5 relative z-10'>
                {/* Logo */}
                <a href='/' className="flex items-center space-x-3 group">
                    <div className="relative overflow-hidden rounded-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out origin-center"></div>
                        <img src='/logo.jpeg' alt='Logo' className='h-12 w-12 object-cover rounded-full relative z-10 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(30,115,190,0.3)] transition-all duration-500' />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl text-[#2C3E50] font-bold tracking-wide group-hover:text-[#1E73BE] transition-colors duration-300 relative">
                            SpringFallUSA
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 group-hover:w-full transition-all duration-500 ease-out"></span>
                        </span>
                        <span className="text-xs text-gray-500 hidden sm:block">Your Gateway to US Education</span>
                    </div>
                </a>

                {/* Desktop Nav Items */}
                <ul className='hidden sm:flex items-center gap-x-8'>
                    {navLists.map((list, index) => (
                        <li key={index} className='flex-shrink-0'>
                            <NavLink
                                to={list.path}
                                className={({ isActive }) =>
                                    `relative px-3 py-2 overflow-hidden group rounded-md font-medium text-base ${
                                        isActive ? 'text-[#1E73BE] font-semibold' : 'text-gray-700'
                                    }`
                                }
                                onClick={closeMenu}
                            >
                                <span className="absolute top-0 left-0 w-full h-0 bg-gradient-to-r from-blue-50 to-blue-100 group-hover:h-full transition-all duration-500 ease-out rounded-md -z-10"></span>
                                <span className="relative">{list.name}</span>
                            </NavLink>
                        </li>
                    ))}
                    <li>
                        {user ? (
                            <Link to='/dashboard'>
                                <button className='relative overflow-hidden bg-gradient-to-r from-[#1E73BE] to-[#2A80C5] text-white py-2.5 px-6 rounded-full shadow-lg hover:shadow-[0_5px_15px_rgba(30,115,190,0.4)] transition-all duration-300 group'>
                                    <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out -z-10"></span>
                                    <span className="absolute top-0 left-0 w-0 h-full bg-white/20 skew-x-[25deg] transition-all duration-700 ease-out group-hover:w-full -z-5"></span>
                                    <span className="relative z-10 flex items-center">Dashboard
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                </button>
                            </Link>
                        ) : (
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    `py-2.5 px-6 rounded-full transition-all duration-300 ${
                                        isActive ? 'bg-[#1E73BE] text-white shadow-lg' : 'bg-white text-[#1E73BE] border border-[#1E73BE]'
                                    }`
                                }
                            >
                                Log In
                            </NavLink>
                        )}
                    </li>
                </ul>

                {/* Mobile Hamburger */}
                <div className='sm:hidden'>
                    <button
                        onClick={toggleMenu}
                        className='relative flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-full text-[#1E73BE] shadow-sm hover:shadow-md group'
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        {isMenuOpen ? (
                            <AiOutlineCloseCircle className='text-2xl transition-transform duration-500 rotate-90 group-hover:rotate-0' />
                        ) : (
                            <CgMenuGridO className='text-2xl group-hover:rotate-90 transition-transform duration-500' />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Nav Drawer */}
            {isMenuOpen && (
                <div className="sm:hidden fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40" onClick={closeMenu}>
                    <div className="absolute right-0 top-[72px] h-screen w-[85%] max-w-[320px] bg-white shadow-2xl animate-slide-in-right" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b border-gray-100 flex items-center">
                            <div className="relative mr-4">
                                <img src='/logo.jpeg' alt='Logo' className='h-14 w-14 object-cover rounded-full relative z-10 border-2 border-white shadow-md' />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">SpringFallUSA</h2>
                                <p className="text-sm text-gray-500">Your Gateway to US Education</p>
                            </div>
                        </div>

                        {/* Nav Items */}
                        <div className="mt-8 px-6">
                            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-6">Navigation</h3>
                            <ul className="space-y-5">
                                {navLists.map((list, index) => (
                                    <li key={index}>
                                        <NavLink
                                            to={list.path}
                                            className={({ isActive }) =>
                                                `block text-center py-2.5 px-6 rounded-full text-base transition-all duration-300 ${
                                                    isActive
                                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                                        : 'bg-white text-[#1E73BE] border border-[#1E73BE]'
                                                }`
                                            }
                                            onClick={closeMenu}
                                        >
                                            {list.name}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Admin + Dashboard or Login Button */}
                        {user && user.role === "admin" && (
                            <div className="px-6 mt-10">
                                <div className="flex items-center bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-blue-100">
                                    <div className="relative mr-4">
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white z-10"></div>
                                        <img src={avatarImg || "/placeholder.svg"} alt='Admin Avatar' className='w-12 h-12 rounded-full object-cover border-2 border-[#1E73BE]' />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">Admin Portal</p>
                                        <p className="text-blue-600 text-xs font-medium">Manage your platform</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="px-6 mt-8">
                            <Link to={user ? "/dashboard" : "/login"} onClick={closeMenu}>
                                <button className='w-full py-3 rounded-full text-white bg-gradient-to-r from-[#1E73BE] to-[#2A80C5] text-lg font-medium'>
                                    {user ? "Access Dashboard" : "Log In"}
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;

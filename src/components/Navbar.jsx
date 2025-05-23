// src/components/Navbar.jsx
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
    { name: "SpringFallSearch", path: '/about-us' }
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
        logoutUser().then(() => dispatch(logout())).catch(console.error);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);
    const isFixedNavbar = location.pathname.includes('/blogs/');

    return (
        <header className={`bg-white w-full z-50 transition-all duration-500 ${scrolled ? 'shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-3' : 'shadow-none py-5'} ${isFixedNavbar ? 'fixed top-0 left-0 right-0' : ''}`}>
            <nav className='container mx-auto flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-10 relative z-10'>

                {/* Logo */}
                <a href='/' className="flex items-center gap-3 group">
                    <div className="relative overflow-hidden rounded-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
                        <img src='/logo.jpeg' alt='Logo' className='h-12 w-12 object-cover rounded-full relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(30,115,190,0.3)]' />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl text-[#2C3E50] font-bold tracking-wide group-hover:text-[#1E73BE] transition-colors duration-300 relative">
                            SpringFallUSA
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 group-hover:w-full transition-all duration-500 ease-out"></span>
                        </span>
                        <span className="text-xs text-gray-500 hidden sm:block">Your Gateway to US Education</span>
                    </div>
                </a>

                {/* Desktop Nav */}
                <ul className='hidden sm:flex space-x-4 md:space-x-6 lg:space-x-10 items-center'>
                    {navLists.map((list, index) => (
                        <li key={index}>
                            <NavLink
                                to={list.path}
                                className={({ isActive }) => `
                                    relative px-3 py-2 rounded-md transition-all
                                    ${isActive ? 'text-[#1E73BE] font-semibold' : 'text-gray-700 hover:text-[#1E73BE]'}
                                `}
                                onClick={closeMenu}
                            >
                                {list.name}
                            </NavLink>
                        </li>
                    ))}
                    {user ? (
                        <li className='flex items-center gap-4'>
                            {user.role === "admin" && (
                                <div className="relative group">
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white z-10"></div>
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                                    <img src={avatarImg || "/placeholder.svg"} alt='Admin Avatar' className='w-10 h-10 rounded-full object-cover border-2 border-[#1E73BE] transition-transform duration-300 group-hover:scale-110 cursor-pointer relative z-0' />
                                </div>
                            )}
                            <Link to='/dashboard'>
                                <button className='py-2.5 px-6 rounded-full bg-gradient-to-r from-[#1E73BE] to-[#2A80C5] text-white hover:shadow-lg transition-all duration-300'>
                                    Dashboard
                                </button>
                            </Link>
                        </li>
                    ) : (
                        <li>
                            <NavLink
                                to="/login"
                                className={({ isActive }) => `
                                    py-2.5 px-6 rounded-full transition-all duration-300
                                    ${isActive 
                                        ? 'bg-[#1E73BE] text-white shadow-lg' 
                                        : 'bg-white text-[#1E73BE] border border-[#1E73BE] hover:bg-[#1E73BE] hover:text-white hover:shadow-md'}
                                `}
                            >
                                Log In
                            </NavLink>
                        </li>
                    )}
                </ul>

                {/* Mobile Hamburger */}
                <div className='sm:hidden'>
                    <button onClick={toggleMenu} className='w-11 h-11 flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-full text-[#1E73BE] shadow-sm hover:shadow-md'>
                        {isMenuOpen ? <AiOutlineCloseCircle className='text-2xl' /> : <CgMenuGridO className='text-2xl' />}
                    </button>
                </div>
            </nav>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="sm:hidden fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40" onClick={closeMenu}>
                    <div className="absolute right-0 top-[72px] w-[85%] max-w-[320px] bg-white shadow-2xl animate-slide-in-right" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                            <div className="flex items-center gap-4">
                                <img src='/logo.jpeg' alt='Logo' className='h-14 w-14 object-cover rounded-full border-2 border-white shadow-md' />
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">SpringFallUSA</h2>
                                    <p className="text-sm text-gray-500">Your Gateway to US Education</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 px-6 space-y-5">
                            {navLists.map((list, index) => (
                                <NavLink
                                    key={index}
                                    to={list.path}
                                    onClick={closeMenu}
                                    className={({ isActive }) => `
                                        block w-full px-5 py-4 text-lg rounded-xl transition-all
                                        ${isActive
                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                            : 'bg-gradient-to-r from-blue-50 to-white text-gray-700 border border-blue-100'}
                                    `}
                                >
                                    {list.name}
                                </NavLink>
                            ))}

                            <div className="mt-10">
                                {user ? (
                                    <Link to='/dashboard' onClick={closeMenu}>
                                        <button className='w-full py-4 rounded-xl bg-gradient-to-r from-[#1E73BE] to-[#2A80C5] text-white shadow-lg hover:shadow-xl transition-all'>
                                            Access Dashboard
                                        </button>
                                    </Link>
                                ) : (
                                    <NavLink
                                        to='/login'
                                        onClick={closeMenu}
                                        className="block w-full py-4 text-center text-white text-lg font-medium rounded-xl bg-gradient-to-r from-[#1E73BE] to-[#2A80C5] shadow-md hover:shadow-xl transition-all"
                                    >
                                        Log In
                                    </NavLink>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;

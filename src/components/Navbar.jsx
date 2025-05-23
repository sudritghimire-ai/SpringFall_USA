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
    { name: "Privacy and Policy", path: '/privacy-policy' }
   /* { name: "SpringFallSearch", path: '/about-us' } */
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const [logoutUser] = useLogoutUserMutation();
    const dispatch = useDispatch();
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logoutUser()
            .then(() => {
                dispatch(logout());
            })
            .catch((error) => {
                console.error("Logout failed", error);
            });
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // Determine if the navbar should be fixed or not based on the current path
    const isFixedNavbar = location.pathname.includes('/blogs/');

    return (
        <header 
            className={
                bg-white
                py-4 font-sans w-full z-50 transition-all duration-500
                ${scrolled ? 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]' : 'shadow-none'} 
                ${isFixedNavbar ? 'fixed top-0 left-0 right-0' : ''}
                ${scrolled ? 'py-3' : 'py-5'}
            }
        >
            <nav className='container mx-auto flex justify-between items-center px-5 relative z-10'>
                {/* Logo + Brand Name */}
                <a href='/' className="flex items-center space-x-3 group">
                    <div className="relative overflow-hidden rounded-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out origin-center"></div>
                        <img 
                            src='/logo.jpeg' 
                            alt='Logo' 
                            className='h-12 w-12 object-cover rounded-full relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(30,115,190,0.3)]' 
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl text-[#2C3E50] font-bold tracking-wide group-hover:text-[#1E73BE] transition-colors duration-300 relative">
                            SpringFallUSA
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 group-hover:w-full transition-all duration-500 ease-out"></span>
                        </span>
                        <span className="text-xs text-gray-500 hidden sm:block">Your Gateway to US Education</span>
                    </div>
                </a>

                {/* Desktop Navigation */}
                <ul className='hidden sm:flex space-x-10 items-center'>
                    {navLists.map((list, index) => (
                        <li key={index}>
                            <NavLink
                                to={list.path}
                                className={({ isActive }) => 
                                    relative px-3 py-2 overflow-hidden group rounded-md
                                    ${isActive ? 'text-[#1E73BE] font-semibold' : 'text-gray-700'}
                                }
                                onClick={closeMenu}
                            >
                                <span className="absolute top-0 left-0 w-full h-0 transition-all duration-500 ease-out bg-gradient-to-r from-blue-50 to-blue-100 rounded-md -z-10 group-hover:h-full"></span>
                                <span className="relative">{list.name}</span>
                                {/* Active indicator */}
                                {({ isActive }) => isActive && (
                                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                )}
                            </NavLink>
                        </li>
                    ))}

                    {user ? (
                        <li className='flex items-center gap-4'>
                            {user.role === "admin" && (
                                <div className="relative group">
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white z-10"></div>
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                                    <img 
                                        src={avatarImg || "/placeholder.svg"} 
                                        alt='Admin Avatar' 
                                        className='w-10 h-10 rounded-full object-cover border-2 border-[#1E73BE] transition-all duration-300 group-hover:scale-110 cursor-pointer relative z-0' 
                                    />
                                </div>
                            )}
                            <Link to='/dashboard'>
                                <button className='relative overflow-hidden bg-gradient-to-r from-[#1E73BE] to-[#2A80C5] text-white py-2.5 px-6 rounded-full shadow-lg transition-all duration-300 hover:shadow-[0_5px_15px_rgba(30,115,190,0.4)] group'>
                                    <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out -z-10"></span>
                                    <span className="absolute top-0 left-0 w-0 h-full bg-white/20 skew-x-[25deg] transform transition-all duration-700 ease-out group-hover:w-full -z-5"></span>
                                    <span className="relative z-10 flex items-center justify-center">
                                        Dashboard
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                </button>
                            </Link>
                        </li>
                    ) : (
                        <li>
                           <NavLink 
  to="/login"
  className={({ isActive }) => 
    py-2.5 px-6 rounded-full transition-all duration-300
    ${isActive 
      ? 'bg-[#1E73BE] text-white shadow-lg' 
      : 'bg-white text-[#1E73BE] border border-[#1E73BE] hover:bg-[#1E73BE] hover:text-white hover:shadow-md'}
  }
>
  Log In
</NavLink>

                        </li>
                    )}
                </ul>

                {/* Hamburger Menu Icon */}
                <div className='sm:hidden'>
                    <button
                        onClick={toggleMenu}
                        className='relative overflow-hidden flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-full text-[#1E73BE] transition-all duration-300 shadow-sm hover:shadow-md group'
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        {isMenuOpen 
                            ? <AiOutlineCloseCircle className='text-2xl relative z-10 transition-transform duration-500 rotate-90 group-hover:rotate-0' /> 
                            : <CgMenuGridO className='text-2xl relative z-10 transition-transform duration-500 group-hover:rotate-90' />
                        }
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="sm:hidden fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40" onClick={closeMenu}>
                    <div 
                        className="absolute right-0 top-[72px] h-screen w-[85%] max-w-[320px] bg-white shadow-2xl animate-slide-in-right"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Brand header */}
                        <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b border-gray-100">
                            <div className="flex items-center">
                                <div className="relative mr-4">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-30"></div>
                                    <img 
                                        src='/logo.jpeg' 
                                        alt='Logo' 
                                        className='h-14 w-14 object-cover rounded-full relative z-10 border-2 border-white shadow-md' 
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">SpringFallUSA</h2>
                                    <p className="text-sm text-gray-500">Your Gateway to US Education</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Navigation links with better spacing */}
                        <div className="mt-8 px-6">
                            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-6">Navigation</h3>
                            
                            <ul className="space-y-5">
                                {navLists.map((list, index) => (
                                    <li key={index}>
                                        <NavLink
                                            to={list.path}
                                            className={({ isActive }) => 
                                                block relative overflow-hidden rounded-xl transition-all duration-300
                                                ${isActive 
                                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                                                    : 'bg-gradient-to-r from-blue-50 to-white text-gray-700 border border-blue-100'}
                                            }
                                            onClick={closeMenu}
                                        >
                                            <div className="relative z-10 py-4 px-5">
                                                <span className="text-lg font-medium">{list.name}</span>
                                            </div>
                                            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 transition-opacity duration-300 hover:opacity-100 -z-10"></span>
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Login/Dashboard button with better spacing */}
                        {user ? (
                            <div className="px-6 mt-10">
                                {user.role === "admin" && (
                                    <div className="flex items-center mb-6 bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-blue-100">
                                        <div className="relative mr-4">
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white z-10"></div>
                                            <img 
                                                src={avatarImg || "/placeholder.svg"} 
                                                alt='Admin Avatar' 
                                                className='w-12 h-12 rounded-full object-cover border-2 border-[#1E73BE]' 
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">Admin Portal</p>
                                            <p className="text-blue-600 text-xs font-medium">Manage your platform</p>
                                        </div>
                                    </div>
                                )}
                                <Link to='/dashboard' onClick={closeMenu} className="block w-full">
                                    <button className='relative overflow-hidden w-full bg-gradient-to-r from-[#1E73BE] to-[#2A80C5] text-white py-4 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-[0_5px_15px_rgba(30,115,190,0.4)] group'>
                                        <span className="absolute top-0 left-0 w-0 h-full bg-white/20 skew-x-[25deg] transform transition-all duration-700 ease-out group-hover:w-full -z-5"></span>
                                        <span className="relative z-10 flex items-center justify-center text-lg font-medium">
                                            Access Dashboard
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="px-6 mt-10">
                                <NavLink 
                                    to='/login' 
                                    onClick={closeMenu} 
                                    className={({ isActive }) => 
                                        relative overflow-hidden block w-full py-4 px-6 rounded-xl transition-all duration-300 group
                                        ${isActive 
                                            ? 'bg-gradient-to-r from-[#1E73BE] to-[#2A80C5] text-white shadow-lg' 
                                            : 'bg-gradient-to-r from-[#1E73BE] to-[#2A80C5] text-white shadow-md hover:shadow-[0_5px_15px_rgba(30,115,190,0.4)]'}
                                    }
                                >
                                    <span className="absolute top-0 left-0 w-0 h-full bg-white/20 skew-x-[25deg] transform transition-all duration-700 ease-out group-hover:w-full -z-5"></span>
                                    <span className="relative z-10 flex items-center justify-center text-lg font-medium">
                                        Log In
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                                        </svg>
                                    </span>
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;

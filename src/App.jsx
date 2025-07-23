"use client"

import { Outlet, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import "./App.css"
import { useEffect, useState } from "react"

function App() {
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(false)
  const [showDialog, setShowDialog] = useState(true)

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    const mobile = /android|iphone|ipod|blackberry|windows phone/i.test(userAgent) || window.innerWidth < 768
    setIsMobile(mobile)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDialog(false)
    }, 5000) // Hide after 5 seconds
    return () => clearTimeout(timer)
  }, [])

  const isBlogPage = /^\/blogs\/[a-zA-Z0-9]+$/.test(location.pathname)
  const isPaused = false // ✅ Set this to false to open the site

  const hideNavbar =
    /^\/blogs\/[a-zA-Z0-9]+$/.test(location.pathname) ||
    location.pathname === "/login" ||
    location.pathname === "/about-us"

  if (isBlogPage && isMobile) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-slate-100 via-blue-50/40 to-amber-50/20 flex items-center justify-center px-6">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-200 max-w-lg text-center animate-fadeIn">
          <div className="mb-4">
            <span className="text-4xl">🚫</span>
          </div>
          <h1 className="text-3xl font-serif-academic font-bold text-red-600 mb-4 tracking-tight">
            Not Available on Mobile
          </h1>
          <p className="text-slate-700 text-lg font-outfit leading-relaxed">
            This academic blog is designed for larger screens.
            <br />
            For the best experience, please use a laptop, desktop, or tablet.
          </p>
          <p className="text-sm text-slate-500 mt-6 font-outfit italic">We’ll see you on a bigger screen! 😊</p>
        </div>
        <style jsx="true">{`
          .animate-fadeIn {
            animation: fadeInUp 0.6s ease-out forwards;
            opacity: 0;
            transform: translateY(15px);
          }
          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    )
  }

  if (isPaused) {
    return (
      <div className="bg-bgPrimary min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-center">🚧 This site is currently paused</h1>
        <p className="mt-2 text-lg">Please check back later.</p>
      </div>
    )
  }

  return (
    <div className="bg-bgPrimary min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}
      <div className="flex-grow">
        <Outlet />
      </div>
      <footer className="mt-auto"></footer>
      {/* Gravity Dialog */}
      {!isPaused && showDialog && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="relative bg-gradient-to-br from-white/20 to-white/10 rounded-3xl shadow-2xl border border-white/30 backdrop-blur-md px-8 py-10 max-w-md w-full text-center animate-fadeInUp overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setShowDialog(false)}
              className="absolute top-4 right-4 text-slate-600 hover:text-blue-700 transition-all duration-300 text-xl font-bold p-2 rounded-full bg-white/50 hover:bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Close"
            >
              ✖
            </button>
            <h2 className="text-4xl font-extrabold font-serif-academic text-blue-700 mb-4 tracking-tight drop-shadow-sm">
              Gravity
            </h2>
            <p className="text-gray-800 font-outfit text-lg leading-relaxed">
              Special thanks to <br />
              <span className="text-blue-500 font-semibold hover:text-blue-600 transition-colors duration-200">
                @kushal_acharya
              </span>{" "}
              <br />
              <span className="text-blue-500 font-semibold hover:text-blue-600 transition-colors duration-200">
                @mukesh_pokhrel
              </span>
            </p>
          </div>
        </div>
      )}
      {/* Fade In Animation */}
      <style jsx="true">{`
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default App

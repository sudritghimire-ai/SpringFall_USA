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

      {/* ✨ Gravity Dialog (Improved UI) */}
      {!isPaused && showDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="relative bg-white/30 border border-white/40 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] px-8 py-10 max-w-md w-full text-center animate-fadeInUp transition-transform duration-500 ease-out hover:scale-105 hover:shadow-3xl ring-1 ring-white/10">
            {/* Close Button */}
            <button
              onClick={() => setShowDialog(false)}
              className="absolute top-4 right-4 text-slate-700 hover:text-blue-700 transition-all text-xl font-bold p-1 rounded-full bg-white/60 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Close"
            >
              ✖
            </button>

            <h2 className="text-4xl font-bold text-blue-900 mb-4 tracking-tight drop-shadow-sm font-serif">
              Gravity
            </h2>
            <p className="text-gray-900 font-medium text-base leading-relaxed font-sans">
              Special thanks to <br />
              <span className="text-blue-600 font-semibold hover:underline">@kushal_acharya</span>
              <br />
              <span className="text-blue-600 font-semibold hover:underline">@mukesh_pokhrel</span>
            </p>
          </div>
        </div>
      )}

      {/* ✨ Animation Styles */}
      <style jsx="true">{`
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .shadow-3xl {
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  )
}

export default App

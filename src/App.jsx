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
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const isBlogPage = /^\/blogs\/[a-zA-Z0-9]+$/.test(location.pathname)
  const isPaused = false

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

      {/* 🌟 Gravity Dialog */}
      {!isPaused && showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-[4px] p-4">
          <div className="relative bg-white bg-opacity-20 backdrop-filter backdrop-blur-md rounded-2xl shadow-lg max-w-md w-full p-8 text-center animate-fadeInUp border border-white border-opacity-30">
            {/* Close Button */}
            <button
              onClick={() => setShowDialog(false)}
              className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition text-2xl font-bold"
              aria-label="Close"
            >
              ✖
            </button>

            <h1 className="text-4xl font-bold text-pink-600 mb-2" style={{ fontFamily: "'Pacifico', cursive" }}>
              Thank You!
            </h1>

            <p className="text-gray-100 mb-6">Your appreciation has been registered by <b>Gravity</b>.</p>

            <div className="flex gap-8 justify-center mb-4 text-white text-lg font-semibold select-none">
              <span>Kushal Acharya</span>
              <span>Mukesh Pokhrel</span>
            </div>

            <p className="text-sm text-gray-300">Follow Us:</p>
            <div className="flex justify-center gap-3 mt-2 text-lg text-red-500">
              <i className="fab fa-facebook cursor-pointer" />
              <i className="fab fa-twitter cursor-pointer" />
              <i className="fab fa-youtube cursor-pointer" />
            </div>
          </div>

          {/* Font + Animation */}
          <style jsx="true">{`
            @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

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
          `}</style>
        </div>
      )}
    </div>
  )
}

export default App

import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import './App.css';
import { useEffect, useState } from "react";

function App() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobile = /android|iphone|ipod|blackberry|windows phone/i.test(userAgent) || window.innerWidth < 768;
    setIsMobile(mobile);
  }, []);

  const isBlogPage = /^\/blogs\/[a-zA-Z0-9]+$/.test(location.pathname);

  const isPaused = false;

  const hideNavbar = (
    /^\/blogs\/[a-zA-Z0-9]+$/.test(location.pathname) ||
    location.pathname === "/login"
  );

  if (isBlogPage && isMobile) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 text-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Not Supported on Mobile</h2>
          <p className="text-slate-700 text-lg">This blog is only accessible on larger screens (laptop, PC, or tablet).</p>
          <p className="text-slate-500 mt-2 text-sm">Please open the site on a bigger device.</p>
        </div>
      </div>
    );
  }

  if (isPaused) {
    return (
      <div className="bg-bgPrimary min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-center">🚧 This site is currently paused</h1>
        <p className="mt-2 text-lg">Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="bg-bgPrimary min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}
      <div className="flex-grow">
        <Outlet />
      </div>
      <footer className="mt-auto"></footer>
    </div>
  );
}

export default App;

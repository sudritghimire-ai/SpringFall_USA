import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import './App.css';

function App() {
  const location = useLocation();

  const hideNavbar = (
    /^\/blogs\/[a-zA-Z0-9]+$/.test(location.pathname) ||
    location.pathname === "/login"
  );

  return (
    <>
      <div className="bg-bgPrimary min-h-screen flex flex-col">
        {!hideNavbar && <Navbar />}
        <div className="flex-grow">
          <Outlet />
        </div>
        <footer className="mt-auto"></footer>
      </div>
    </>
  );
}

export default App;

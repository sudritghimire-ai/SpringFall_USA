import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import './App.css';

function App() {
  const location = useLocation();

  // hide navbar for single blog detail pages
  const isBlogDetailPage = /^\/blogs\/[a-zA-Z0-9]+$/.test(location.pathname);

  return (
    <>
      <div className="bg-bgPrimary min-h-screen flex flex-col">
        {!isBlogDetailPage && <Navbar />}
        <div className="flex-grow">
          <Outlet />
        </div>
        <footer className="mt-auto"></footer>
      </div>
    </>
  );
}

export default App;

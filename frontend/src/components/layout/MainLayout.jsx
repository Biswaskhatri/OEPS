import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  const showFooter = location.pathname === "/";

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <main className="pt-16">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </>
  );
}

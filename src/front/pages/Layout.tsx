import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import Sidebar from '../components/Sidebar';

// Base component that maintains the navbar and footer throughout the page and the scroll-to-top functionality.
export const Layout: React.FC = (): JSX.Element => {
  const location = useLocation();

  const isLoginPage = location.pathname === "/loginpage";

  return (
    <ScrollToTop>
      <Navbar />
      <Outlet />
      <Footer />
      {!isLoginPage && <Sidebar />}
    </ScrollToTop>
  );
};
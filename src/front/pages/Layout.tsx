import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import Sidebar from '../components/Sidebar';

export const Layout: React.FC = (): JSX.Element => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/loginpage";

  return (
    <ScrollToTop>
      {!isLoginPage ? (
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex flex-col flex-grow lg:ml-64 w-full">
            <Navbar />
            <main className="flex-grow p-4 bg-gray-100">
              <Outlet />
            </main>
            <Footer />
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </ScrollToTop>
  );
};

import React from 'react';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

// Base component that maintains the navbar and footer throughout the page and the scroll-to-top functionality.
export const Layout: React.FC = (): JSX.Element => (
  <ScrollToTop>
    <Navbar />
    <Outlet />
    <Footer />
  </ScrollToTop>
);

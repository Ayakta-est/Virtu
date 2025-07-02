import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import { Layout } from './pages/Layout';
import { Home } from './pages/Home';
import LoginPage from './pages/LoginPage';

// Define the application router with typed JSX routes
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      {/* Root route */}
      <Route index element={<Home />} />
      <Route path="loginpage" element={<LoginPage />} />
    </Route>
  )
);

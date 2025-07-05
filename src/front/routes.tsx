import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import { Layout } from './pages/Layout';
import { Home } from './pages/Home';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/Admin/UsersPage';
import DashboardPage from './pages/DashboardPage';
import NotAuthorized from './pages/NotAuthorizedPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import CreateNews from './pages/Admin/CreateNews';
import EmployeeProfile from './pages/Employee/EmployeeProfile';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route index element={<Home />} />
      <Route path="loginpage" element={<LoginPage />} />

      {/* Rutas protegidas */}
      <Route
        path="employee/dashboardpage"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin/users"
        element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/notices/new" element={
        <ProtectedRoute>
          <CreateNews />
      </ProtectedRoute>} />

      <Route path="/employee" element={
        <ProtectedRoute>
          <EmployeeProfile />
      </ProtectedRoute>} />

      {/* Página para accesos denegados */}
      <Route path="not-authorized" element={<NotAuthorized />} />
    </Route>
  )
);

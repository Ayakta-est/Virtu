import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/Admin/UsersPage";
import DashboardPage from "./pages/DashboardPage";
import NotAuthorized from "./pages/NotAuthorizedPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CreateNews from "./pages/Admin/CreateNews";
import EmployeeProfile from "./pages/Employee/EmployeeProfile";
import NoticesList from "./pages/Admin/NoticesList";
import { AdminRoute } from "./components/admin/AdminRoute";
import { Outlet } from 'react-router-dom';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>

      {/* Página pública */}
      <Route index element={<Home />} />
      <Route path="loginpage" element={<LoginPage />} />
      <Route path="not-authorized" element={<NotAuthorized />} />

      {/* Rutas protegidas para usuarios autenticados */}
      <Route element={<ProtectedRoute> <Outlet /> </ProtectedRoute>}>
        <Route path="employee" element={<EmployeeProfile />} />
        <Route path="employee/dashboardpage" element={<DashboardPage />} />

        {/* Rutas solo para administradores */}
        <Route element={<AdminRoute> <Outlet /> </AdminRoute>}>
          <Route path="admin/users" element={<UsersPage />} />
          <Route path="admin/noticias" element={<NoticesList />} />
          <Route path="admin/notices/new" element={<CreateNews />} />
        </Route>
      </Route>
    </Route>
  )
);

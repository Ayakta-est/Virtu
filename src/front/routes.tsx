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
import EmployeeCalendar from "./pages/Employee/EmployeeCalendar";
import NotAuthorized from "./pages/NotAuthorizedPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CreateNews from "./pages/Admin/CreateNews";
import EmployeeProfile from "./pages/Employee/EmployeeProfile";
import NoticesList from "./pages/Admin/NoticesList";
import EditNews from "./pages/Admin/EditNews";
import { AdminRoute } from "./components/admin/AdminRoute";
import { Outlet } from 'react-router-dom';
import DetailNotice from './pages/DetailNotice';
import CalendarManagementPage from "./pages/Admin/CalendarManagementPage";
import CalendarApplicationPage from "./pages/Admin/CalendarApplicationPage";
import AdminEmployeeCalendarPage from "./pages/Admin/AdminEmployeeCalendarPage";
import PayRollPage from "./pages/Employee/PayrollPage";
import PayrollDetailPage from "./pages/Employee/PayrollDetailPage";

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
        <Route path="employee/calendar" element={<EmployeeCalendar />} />
        <Route path="/notices/:id" element={<DetailNotice />} />
        <Route path="employee/payroll" element={<PayRollPage />} />
        <Route path="employee//payroll/:id" element={<PayrollDetailPage />} />

        {/* Rutas solo para administradores */}
        <Route element={<AdminRoute> <Outlet /> </AdminRoute>}>
          <Route path="admin/users" element={<UsersPage />} />
          <Route path="admin/notices" element={<NoticesList />} />
          <Route path="admin/notices/new" element={<CreateNews />} />
          <Route path="admin/notices/edit/:id" element={<EditNews />} />
          <Route path="admin/calendar/application" element={<CalendarApplicationPage />} />
          <Route path="admin/calendar-management" element={<CalendarManagementPage />} />
          <Route path="admin/calendar/:identification_number" element={<AdminEmployeeCalendarPage />} />
        </Route>
      </Route>
    </Route>
  )
);

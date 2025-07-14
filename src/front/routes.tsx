import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  Outlet,
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
import DetailNotice from "./pages/DetailNotice";
import CalendarManagementPage from "./pages/Admin/CalendarManagementPage";
import CalendarApplicationPage from "./pages/Admin/CalendarApplicationPage";
import AdminEmployeeCalendarPage from "./pages/Admin/AdminEmployeeCalendarPage";
import PayRollPage from "./pages/Employee/PayrollPage";
import PayrollDetailPage from "./pages/Employee/PayrollDetailPage";
import AdminPayrollManagementPage from "./pages/Admin/AdminPayrollManagementPage";
import EmployeeAssistantPage from "./pages/Employee/EmployeeAssistantPage";
import AdminOvertimeManagementPage from "./pages/Admin/AdminOvertimeManagementPage";

// Redirección si ya hay token al acceder a /loginpage
const RedirectIfAuthenticated = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : <>{children}</>;
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>

      {/* Login público (redirige si ya hay user) */}
      <Route
        path="loginpage"
        element={
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
        }
      />

      {/* Ruta pública (opcional) */}
      <Route path="not-authorized" element={<NotAuthorized />} />

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
        {/* Página de inicio protegida */}
        <Route index element={<Home />} />

        {/* Rutas para empleados */}
        <Route path="employee" element={<EmployeeProfile />} />
        <Route path="employee/calendar" element={<EmployeeCalendar />} />
        <Route path="employee/payroll" element={<PayRollPage />} />
        <Route path="employee/payroll/:id" element={<PayrollDetailPage />} />
        <Route path="/notices/:id" element={<DetailNotice />} />
        <Route path="employee/assistant" element={<EmployeeAssistantPage />} />

        {/* Admin protegidas */}
        <Route element={<AdminRoute><Outlet /></AdminRoute>}>
          <Route path="admin/users" element={<UsersPage />} />
          <Route path="admin/notices" element={<NoticesList />} />
          <Route path="admin/notices/new" element={<CreateNews />} />
          <Route path="admin/notices/edit/:id" element={<EditNews />} />
          <Route path="admin/calendar/application" element={<CalendarApplicationPage />} />
          <Route path="admin/calendar-management" element={<CalendarManagementPage />} />
          <Route path="admin/calendar/:identification_number" element={<AdminEmployeeCalendarPage />} />
          <Route path="admin/overtime-management" element={<AdminOvertimeManagementPage />} />
          <Route path="admin/payroll-management" element={<AdminPayrollManagementPage />} />
        </Route>
      </Route>
    </Route>
  )
);

import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

// 👇 Permitir cualquier ReactNode, no solo JSX.Element
export function AdminRoute({ children }: { children: ReactNode }) {
  const { store } = useGlobalReducer();

  if (store.user?.role !== "admin") return <Navigate to="/not-authorized" />;

  return <>{children}</>;
}

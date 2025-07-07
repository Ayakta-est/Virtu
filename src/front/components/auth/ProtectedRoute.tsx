import React from "react";
import { Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { store } = useGlobalReducer();
  const user = store.user

  if (!user) {
    return <Navigate to="/loginpage" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

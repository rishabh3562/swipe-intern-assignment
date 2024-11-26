import React, { Suspense, ReactNode } from "react";
import { Outlet, Navigate } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";

interface ProtectedRouteProps {
  isAuth: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuth }) => {
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

interface FallbackProps {
  element: ReactNode;
}

const Fallback: React.FC<FallbackProps> = ({ element }) => (
  <ErrorBoundary>
    <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>
  </ErrorBoundary>
);

interface WrapperProps {
  element: ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ element }) => {
  return (
    <ErrorBoundary>
      <Fallback element={element} />
    </ErrorBoundary>
  );
};

export { ProtectedRoute, Fallback, Wrapper };

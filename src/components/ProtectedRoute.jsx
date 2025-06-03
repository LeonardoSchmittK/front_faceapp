import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useStore from '../store/store.js';

const ProtectedRoute = () => {
  const isUserLogged = useStore((state) => state.isUserLogged);

  return isUserLogged ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
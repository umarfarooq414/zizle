import React from 'react';
import { Navigate } from 'react-router-dom';
import { browserRoutes } from '../routes/browserRoutes';

const ProtectedRoutesMod = (props) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return (
      <Navigate to={props?.redirectLink ? props?.redirectLink : browserRoutes.USER_LOGIN} replace />
    );
  }
  return props?.children;
};
export default ProtectedRoutesMod;

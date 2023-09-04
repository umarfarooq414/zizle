import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthRoutesMod = (props) => {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to={props.redirectLink} replace />;
  }
  return props.children;
};
export default AuthRoutesMod;

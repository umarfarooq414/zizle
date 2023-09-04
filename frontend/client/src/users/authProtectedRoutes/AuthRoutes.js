import React from 'react';
import { useUser } from '../../providers/useUser';
import { Navigate } from 'react-router-dom';

const AuthRoutes = (props) => {
  const { token } = useUser();

  if (token) {
    return <Navigate to={props.redirectLink} replace />;
  }
  return props.children;
};
export default AuthRoutes;

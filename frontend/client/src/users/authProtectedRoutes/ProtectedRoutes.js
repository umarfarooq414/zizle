import React from 'react';
import { Navigate } from 'react-router-dom';
import { browserRoutes } from '../routes/browserRoutes';
import { useUser } from '../../providers/useUser';

const ProtectedRoutes = (props) => {
  const { token } = useUser();
  if (!token) {
    return (
      <Navigate to={props?.redirectLink ? props?.redirectLink : browserRoutes.USER_LOGIN} replace />
    );
  }
  return props?.children;
};
export default ProtectedRoutes;

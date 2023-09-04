/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../providers/useUser';
import { browserRoutes } from '../routes/browserRoutes';

const ProtectedRoutesAdmin = (props) => {
  const { token } = useUser()
  // const token = localStorage.getItem('token');
  if (!token) {
    return (
      <Navigate to={props?.redirectLink ? props?.redirectLink : browserRoutes.USER_LOGIN} replace />
    );
  }
  return props?.children;
};
export default ProtectedRoutesAdmin;

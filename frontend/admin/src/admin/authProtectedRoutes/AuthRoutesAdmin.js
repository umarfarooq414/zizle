/* eslint-disable react/prop-types */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../providers/useUser';

const AuthRoutesAdmin = (props) => {
  // eslint-disable-next-line no-undef
  const { token } = useUser()
  // const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to={props.redirectLink} replace />;
  }
  return props.children;
};
export default AuthRoutesAdmin;

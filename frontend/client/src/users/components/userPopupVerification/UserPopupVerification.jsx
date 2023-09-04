import React from 'react';
import styled from './style.module.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../providers/useUser';
const UserPopupVerification = (props) => {
  const { setToken, setUser } = useUser;
  const navigate = useNavigate();
  localStorage.removeItem('userCatchMessage');
  localStorage.removeItem('userSuccessStatus');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  return (
    <div>
      <div>
        {/* eslint-disable */}
        <div className={styled.overlay}></div>
        <div className={styled.modelMain}>
          <div className={styled.modelContainer}>
            <h2>You're almost there!</h2>
            <p>Please check your inbox. We've sent you a verification email to</p>
            <a href='mailto:{props.email}'>{props.email}</a>

            <p>No email received?</p>
            <p>You can't find the email in your inbox or spam folder</p>
            <button className={styled.logoutBtn} onClickCapture={logout}>
              logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserPopupVerification;

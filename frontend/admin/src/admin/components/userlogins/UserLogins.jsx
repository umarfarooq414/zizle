import React from 'react';
import AdminPanelHeader from '../admin/adminHeader/AdminHeader';
import styled from './style.module.css';

const UserLogins = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.pageForm}>page form</div>
    </div>
  );
};

export default UserLogins;

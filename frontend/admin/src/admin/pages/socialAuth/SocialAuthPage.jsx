import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import SocialAuth from '../../components/admin/adminBody/socialAuth/SocialAuth';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const SocialAuthPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <SocialAuth />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default SocialAuthPage;

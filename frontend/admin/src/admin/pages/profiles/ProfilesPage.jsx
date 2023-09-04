import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import Profiles from '../../components/admin/adminBody/profiles/Profiles';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const ProfilesPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <Profiles />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default ProfilesPage;

import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import GebannteProfile from '../../components/admin/adminBody/gebannteProfile/GebannteProfile';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const GebannteProfilePage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <GebannteProfile />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default GebannteProfilePage;

import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import GelöschteProfile from '../../components/admin/adminBody/gelöschteProfile/GelöschteProfile';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const GelöschteProfilePage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <GelöschteProfile />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default GelöschteProfilePage;

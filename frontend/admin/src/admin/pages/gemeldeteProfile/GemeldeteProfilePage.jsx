import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import GemeldeteProfile from '../../components/admin/adminBody/gemeldeteProfile/GemeldeteProfile';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const GemeldeteProfilePage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <GemeldeteProfile />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default GemeldeteProfilePage;

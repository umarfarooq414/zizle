import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import ProfilMedien from '../../components/admin/adminBody/profilMedien/ProfilMedien';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const ProfilMedienPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <ProfilMedien />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default ProfilMedienPage;

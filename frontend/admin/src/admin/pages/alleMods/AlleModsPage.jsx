import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import AlleMods from '../../components/admin/adminBody/alleMods/AlleMods';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const AlleModsPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <AlleMods />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default AlleModsPage;

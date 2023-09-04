import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import Mods from '../../components/admin/adminBody/mods/Mods';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const ModsPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <Mods />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default ModsPage;

import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import Einstellungen from '../../components/admin/adminBody/einstellungen/Einstellungen';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const EinstellungenPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <Einstellungen />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default EinstellungenPage;

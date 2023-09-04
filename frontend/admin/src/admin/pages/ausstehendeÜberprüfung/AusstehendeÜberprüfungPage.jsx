import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import AusstehendeÜberprüfung from '../../components/admin/adminBody/ausstehendeÜberprüfung/AusstehendeÜberprüfung';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const AusstehendeÜberprüfungPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <AusstehendeÜberprüfung />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default AusstehendeÜberprüfungPage;

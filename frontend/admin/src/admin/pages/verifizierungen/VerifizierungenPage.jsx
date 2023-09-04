import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import Verifizierungen from '../../components/admin/adminBody/verifizierungen/Verifizierungen';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const VerifizierungenPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <Verifizierungen />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default VerifizierungenPage;

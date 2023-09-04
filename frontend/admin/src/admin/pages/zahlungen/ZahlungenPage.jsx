import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import Zahlungen from '../../components/admin/adminBody/zahlungen/Zahlungen';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const ZahlungenPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <Zahlungen />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default ZahlungenPage;

import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import AlleZahlungen from '../../components/admin/adminBody/alleZahlungen/AlleZahlungen';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const AlleZahlungenPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <AlleZahlungen />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default AlleZahlungenPage;

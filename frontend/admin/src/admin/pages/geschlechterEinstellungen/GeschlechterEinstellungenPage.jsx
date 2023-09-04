import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import GeschlechterEinstellungen from '../../components/admin/adminBody/geschlechterEinstellungen/GeschlechterEinstellungen';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const GeschlechterEinstellungenPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <GeschlechterEinstellungen />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default GeschlechterEinstellungenPage;

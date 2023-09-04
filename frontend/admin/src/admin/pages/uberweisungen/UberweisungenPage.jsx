import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import Uberweisungen from '../../components/admin/adminBody/uberweisungen/Uberweisungen';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const UberweisungenPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <Uberweisungen />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default UberweisungenPage;

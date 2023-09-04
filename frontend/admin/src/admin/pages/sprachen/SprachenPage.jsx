import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import Sprachen from '../../components/admin/adminBody/sprachen/Sprachen';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const SprachenPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <Sprachen />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default SprachenPage;

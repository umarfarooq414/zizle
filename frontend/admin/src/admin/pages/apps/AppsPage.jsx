import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import Apps from '../../components/admin/adminBody/apps/Apps';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const AppsPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <Apps />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default AppsPage;

import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import Dashboard from '../../components/admin/adminBody/dashboard/Dashboard';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const DashboardPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <Dashboard />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default DashboardPage;

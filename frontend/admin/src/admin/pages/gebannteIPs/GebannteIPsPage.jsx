import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import GebannteIPs from '../../components/admin/adminBody/gebannteIPs/GebannteIPs';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const GebannteIPsPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <GebannteIPs />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default GebannteIPsPage;

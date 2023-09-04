import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import AlleMedien from '../../components/admin/adminBody/alleMedien/AlleMedien';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const AlleMedienPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <AlleMedien />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default AlleMedienPage;

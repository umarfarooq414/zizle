import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import Software from '../../components/admin/adminBody/software/Software';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const SoftwarePage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <Software />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default SoftwarePage;

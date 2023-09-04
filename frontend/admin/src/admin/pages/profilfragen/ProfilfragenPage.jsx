import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import Profilfragen from '../../components/admin/adminBody/profilfragen/Profilfragen';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const ProfilfragenPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <Profilfragen />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default ProfilfragenPage;

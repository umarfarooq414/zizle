import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import Pages from '../../components/admin/adminBody/pages/Pages';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const PagesPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <Pages />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default PagesPage;

import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import InBearbeitung from '../../components/admin/adminBody/inBearbeitung/InBearbeitung';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const InBearbeitungPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <InBearbeitung />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default InBearbeitungPage;

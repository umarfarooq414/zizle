import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import AlleProfile from '../../components/admin/adminBody/alleProfile/AlleProfile';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const AlleProfilePage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <AlleProfile />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default AlleProfilePage;

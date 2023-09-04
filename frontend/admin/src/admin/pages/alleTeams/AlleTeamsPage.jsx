import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import AlleTeams from '../../components/admin/adminBody/alleTeams/AlleTeams';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const AlleTeamsPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <AlleTeams />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default AlleTeamsPage;

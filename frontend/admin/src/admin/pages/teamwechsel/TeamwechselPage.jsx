import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import Teamwechsel from '../../components/admin/adminBody/teamwechsel/Teamwechsel';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const TeamwechselPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <Teamwechsel />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default TeamwechselPage;

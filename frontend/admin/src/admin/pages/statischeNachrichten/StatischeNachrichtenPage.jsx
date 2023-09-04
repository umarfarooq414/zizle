import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import StatischeNachrichten from '../../components/admin/adminBody/statischeNachrichten/StatischeNachrichten';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const StatischeNachrichtenPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <StatischeNachrichten />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default StatischeNachrichtenPage;

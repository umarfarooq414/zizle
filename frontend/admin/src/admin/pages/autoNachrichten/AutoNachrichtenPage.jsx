import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import AutoNachrichten from '../../components/admin/adminBody/autoNachrichten/AutoNachrichten';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const AutoNachrichtenPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <AutoNachrichten />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default AutoNachrichtenPage;

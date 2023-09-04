import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import MultiNachrichten from '../../components/admin/adminBody/multiNachrichten/MultiNachrichten';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const MultiNachrichtenPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <MultiNachrichten />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default MultiNachrichtenPage;

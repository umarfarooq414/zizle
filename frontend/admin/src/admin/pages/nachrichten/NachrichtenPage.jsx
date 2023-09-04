import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import Nachrichten from '../../components/admin/adminBody/nachrichten/Nachrichten';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const NachrichtenPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <Nachrichten />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default NachrichtenPage;

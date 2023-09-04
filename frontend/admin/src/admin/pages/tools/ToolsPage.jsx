import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import Tools from '../../components/admin/adminBody/tools/Tools';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const ToolsPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <Tools />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default ToolsPage;

import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import Plugins from '../../components/admin/adminBody/plugins/Plugins';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const PluginsPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <Plugins />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default PluginsPage;

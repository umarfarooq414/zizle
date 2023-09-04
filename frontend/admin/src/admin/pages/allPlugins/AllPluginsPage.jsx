import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import AllPlugins from '../../components/admin/adminBody/allPlugins/AllPlugins';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const AllPluginsPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <AllPlugins />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default AllPluginsPage;

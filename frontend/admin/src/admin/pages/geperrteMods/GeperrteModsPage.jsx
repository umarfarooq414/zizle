import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import GeperrteMods from '../../components/admin/adminBody/geperrteMods/GeperrteMods';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const GeperrteModsPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <GeperrteMods />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default GeperrteModsPage;

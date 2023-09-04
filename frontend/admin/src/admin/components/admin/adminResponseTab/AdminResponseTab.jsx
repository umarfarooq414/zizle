import React from 'react';
import AdminUploadResponse from '../adminUploadResponse/AdminUploadResponse';
import styled from './style.module.css';
import AdminPanelHeader from '../adminHeader/AdminHeader';
import AdminLeft from '../adminLeft/AdminLeft';

const AdminResponseTab = () => {
  return (
    <div>
      <div>
        <AdminPanelHeader />
        <div className={styled.adminPanelMain}>
          <div className={styled.leftpart}>
            <AdminLeft />
          </div>
          <div className={styled.rightpart}>
            <AdminUploadResponse />
          </div>
          <div className={styled.clear}></div>
        </div>
      </div>
    </div>
  );
};

export default AdminResponseTab;

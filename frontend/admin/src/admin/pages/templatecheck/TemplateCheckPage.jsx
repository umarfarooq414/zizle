import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import TemplateCheck from '../../components/admin/adminBody/templatecheck/TemplateCheck';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const TemplateCheckPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <TemplateCheck />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default TemplateCheckPage;

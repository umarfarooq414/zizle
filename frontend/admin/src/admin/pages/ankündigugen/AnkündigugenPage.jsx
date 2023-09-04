import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import Ankündigugen from '../../components/admin/adminBody/ankündigugen/Ankündigugen';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const AnkündigugenPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <Ankündigugen />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default AnkündigugenPage;

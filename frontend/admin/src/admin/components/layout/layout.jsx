import React from 'react';
import AdminPanelHeader from '../admin/adminHeader/AdminHeader';
import AdminLeft from '../admin/adminLeft/AdminLeft';
import styled from '../../pages/aDatingStyle/style.module.css';
import { useMemo } from 'react';
import { protectedRoutes } from '../../routes/browserRoutes';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  const isProtected = useMemo(() => {
    return protectedRoutes.includes(pathname);
  }, [pathname]);

  return !isProtected ? (
    children
  ) : (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;

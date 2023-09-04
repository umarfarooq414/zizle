import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import PostbackTracking from '../../components/admin/adminBody/postbackTracking/PostbackTracking';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const PostbackTrackingPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <PostbackTracking />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default PostbackTrackingPage;

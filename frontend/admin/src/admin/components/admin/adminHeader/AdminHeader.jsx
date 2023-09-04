import React from 'react';
import { Link } from 'react-router-dom';
import styled from './style.module.css';
import ProfilePic from '../../../../assets/images/profile_pic.jpg';
import LogoPic from '../../../../assets/images/logo_main.png';

const AdminHeader = () => {
  return (
    <div>
      <div className={styled.headerMain}>
        <div className={styled.headerInner}>
          <div className={styled.headLeft}>
            <Link to='/admin/dashboard'>
              <img src={LogoPic} alt='' />
            </Link>
          </div>
          <div className={styled.headRight}>
            <div className={styled.clear}></div>
          </div>
          <div className={styled.clear}></div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;

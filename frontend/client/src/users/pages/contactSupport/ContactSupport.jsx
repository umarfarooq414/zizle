import React from 'react';
import UserContactSupport from '../../components/userContactSupport/UserContactSupport';
// import SettingTabs from "../../components/settingTabs/SettingTabs";
import styled from './style.module.css';

const ContactSupport = () => {
  return (
    <div className={styled.UserLeftNavigation}>
      <UserContactSupport />
    </div>
  );
};

export default ContactSupport;

import React from 'react';
import UserHeaderLogo from '../../components/userHeaderLogo/UserHeaderLogo';
import UserLeftContent from '../../components/userLeftContent/UserLeftContent';
// import SettingTabs from "../../components/settingTabs/SettingTabs";
import styled from './style.module.css';
// import UserAnnoucement from '../../components/userAnnoucement/userAnnoucement';
import UserAnnoucementLeft from '../../components/userAnnoucementLeft/UserAnnoucementLeft';

const UserAnnoucements = () => {
  return (
    <div className={styled.UserLeftNavigation}>
      <UserAnnoucementLeft />
    </div>
  );
};

export default UserAnnoucements;

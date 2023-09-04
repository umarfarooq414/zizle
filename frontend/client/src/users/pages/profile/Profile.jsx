import React from 'react';
import UserHeaderButtons from '../../components/userHeaderButtons/UserHeaderButtons';
import UserHeaderLogo from '../../components/userHeaderLogo/UserHeaderLogo';
import UserLeftContent from '../../components/userLeftContent/UserLeftContent';
// import SettingTabs from "../../components/settingTabs/SettingTabs";
import styled from './style.module.css';
import ProfileTab from '../../components/profileTabs/ProfileTab';

const Profile = () => {
  return (
    <div className={styled.UserLeftNavigation}>
      <ProfileTab />
    </div>
  );
};
export default Profile;

import React from 'react';
import UserHeaderButtons from '../../components/userHeaderButtons/UserHeaderButtons';
import UserHeaderLogo from '../../components/userHeaderLogo/UserHeaderLogo';
import UserLeftContent from '../../components/userLeftContent/UserLeftContent';
import SettingTabs from '../../components/settingTabs/SettingTabs';
import styled from './style.module.css';

const Setting = () => {
  return (
    <div className={styled.UserLeftNavigation}>
      <SettingTabs />
    </div>
  );
};

export default Setting;

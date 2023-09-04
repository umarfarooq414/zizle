import React from 'react';
// import SettingTabs from "../../components/settingTabs/SettingTabs";
import SettingTabBlockMembers from '../../components/settingTabBlockMembers/SettingTabBlockMembers';
import styled from './style.module.css';

const BlockPage = () => {
  return (
    <div className={styled.UserLeftNavigation}>
      <SettingTabBlockMembers />
    </div>
  );
};

export default BlockPage;

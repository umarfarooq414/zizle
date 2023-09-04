import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import SettingTabManageAccount from '../settingTabManageAccount/SettingTabManageAccount';
import SettingTabBlockMembers from '../settingTabBlockMembers/SettingTabBlockMembers';
import SettingTabNotification from '../settingTabNotification/SettingTabNotification';
import SettingTabPayment from '../settingTabPayment/SettingTabPayment';
import styled from './style.module.css';

const SettingTabs = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };

  return (
    <div className={styled.UserRightNavigation}>
      <Box>
        <Box>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            {/* <Tab label='Manage Account' /> */}
            <Tab label='Block Members' />
            <Tab label='Notification' />
            <Tab label='Payments' />
          </Tabs>
        </Box>
        <Box sx={{ padding: 2 }}>
          {/* {tabIndex === 0 && (
            <Box>
              <SettingTabManageAccount />
            </Box>
          )} */}
          {tabIndex === 0 && (
            <Box>
              <SettingTabBlockMembers />
            </Box>
          )}
          {tabIndex === 1 && (
            <Box>
              <SettingTabNotification />
            </Box>
          )}
          {tabIndex === 2 && (
            <Box>
              <SettingTabPayment />
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};
export default SettingTabs;

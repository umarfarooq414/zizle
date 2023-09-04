import React from 'react';
import { useLocation } from 'react-router-dom';
import UserLeftContent from '../../components/userLeftContent/UserLeftContent';
// import SettingTabs from "../../components/settingTabs/SettingTabs";
import UserHomeTabs from '../../components/userHomeTabs/UserHomeTabs';
import styled from './style.module.css';
import UserPopupVerification from '../../components/userPopupVerification/UserPopupVerification';
// import UserPopupVerification from "../../components/userPopupVerification/UserPopupVerification";
import UserHeaderLogo from '../../components/userHeaderLogo/UserHeaderLogo';
import UserHeaderButtons from '../../components/userHeaderButtons/UserHeaderButtons';
import { useUser } from '../../../providers/useUser';

const UserHome = ({ navigation }) => {
  const { token } = useUser();

  const location = useLocation();
  const { state } = location;
  // const token = state?.token;
  // const token = accessToken;

  return <UserHomeTabs tokenId={token} />;
};

export default UserHome;

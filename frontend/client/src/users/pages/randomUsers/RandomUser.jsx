import React from 'react';
import UserHeaderButtons from '../../components/userHeaderButtons/UserHeaderButtons';
import UserHeaderLogo from '../../components/userHeaderLogo/UserHeaderLogo';
import UserLeftContent from '../../components/userLeftContent/UserLeftContent';
import styled from './style.module.css';
import HomeRandomUsers from '../../components/homeRandomUsers/HomeRandomUsers';

const RandomUser = () => {
  return (
    <div className={styled.UserLeftNavigation}>
      <HomeRandomUsers />
    </div>
  );
};

export default RandomUser;

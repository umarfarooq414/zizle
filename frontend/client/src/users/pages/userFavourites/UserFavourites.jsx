import React from 'react';
import UserHeaderButtons from '../../components/userHeaderButtons/UserHeaderButtons';
import UserHeaderLogo from '../../components/userHeaderLogo/UserHeaderLogo';
import UserLeftContent from '../../components/userLeftContent/UserLeftContent';
import styled from './style.module.css';
import UserFavourite from '../../components/userFavourites/UserFavourites';

const UserFavourites = () => {
  return (
    <div className={styled.UserLeftNavigation}>
      <UserFavourite />
    </div>
  );
};
export default UserFavourites;

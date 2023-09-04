import React from 'react';
import styled from './style.module.css';
import HeaderLogo from '../../../assets/images/logo_main.png';
import { Link } from 'react-router-dom';

export const HeaderLeft = () => {
  return (
    <>
      <div className={styled.headerLogo}>
        <Link to='/home'>
          <img src={HeaderLogo} alt='' />
        </Link>
      </div>
    </>
  );
};

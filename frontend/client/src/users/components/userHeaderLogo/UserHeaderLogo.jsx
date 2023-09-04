import React from 'react';
import { Link } from 'react-router-dom';
import MainLogo from '../../../assets/images/logo_main.png';
import styled from './styled.css'
const UserHeaderLogo = () => {
  return (
    <div className='logo_user'>
      <Link to='/userHome'>
        <img src={MainLogo} alt='logo_image' style={{ maxWidth: window.innerWidth <= 786 ? '150px' : '150px', paddingTop: window.innerWidth <= 786 ? '15px' : '7px' }} />
      </Link>
    </div>
  );
};

export default UserHeaderLogo;

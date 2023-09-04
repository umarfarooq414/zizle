/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useRoutes } from 'react-router-dom';
import styled from './style.module.css';
import LogoMain from '../../../assets/images/logo_main.png';
import ForHim from '../../../assets/images/forHim.svg';
import ForHer from '../../../assets/images/forHer.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { resigterUserAction, userLoginAction } from '../../../store/slices/userAuth/actions';
import { unwrapResult } from '@reduxjs/toolkit';
import { GoogleLogin } from '@leecheuk/react-google-login';
import { gapi } from 'gapi-script';
import axios from 'axios';
import { toast } from 'react-toastify';
import FacebookLogin from '@greatsumini/react-facebook-login';
import UserMainRegisters from '../../components/userMainRegister/UserMainRegister';

const UserMainRegister = ({ setToken }) => {
  return (
    <div>
      <UserMainRegisters setToken={setToken} />
    </div>
  );
};

export default UserMainRegister;

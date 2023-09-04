import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import styled from './style.module.css';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import {createModeratorAction} from '../../../../../store/slices/userAuth/actions'
const mainHeading = {
  marginBottom: '10px',
  margin: '0px auto 30px',
  textAlign: 'center',
};

const CreateModerator = () => {
      const [userName, setUsername] = useState('');
      const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const dispatch = useDispatch();

  const moderatorHandler = (e) => {
    e.preventDefault();
     const payload = {
    userName,
    email,
    password,
  };
     dispatch(createModeratorAction(payload))
      .then(unwrapResult)
      .then((result) => {
        // setListData(result.data);
      })
      .catch((error) => { });
  };

  return (
    <div>
      <Typography variant='h6' sx={mainHeading}>
        Dashboard {'>'} Create Moderator
      </Typography>

      <div className={styled.createFakeUser}>
        <form enctype='multipart/form-data'>
          <div className={`${styled.fromGroup} ${styled.fromGroupFull}`}>
            <label>Username</label>
            <input type='text' name='username' onChange={(e) => setUsername(e.target.value)}/>
          </div>
          <div className={`${styled.fromGroup} ${styled.fromGroupFull}`}>
            <label>Email</label>
            <input type='email' name='email' onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className={`${styled.fromGroup} ${styled.fromGroupFull}`}>
            <label>Password</label>
            <input type='password' name='password' onChange={(e) => setPassword(e.target.value)}/>
          </div>

          <div className={`${styled.fromGroup} ${styled.fromGroupFull}`}>
            <button type='button' onClick={moderatorHandler}>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModerator;

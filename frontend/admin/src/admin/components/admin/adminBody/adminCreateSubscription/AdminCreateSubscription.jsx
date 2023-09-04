import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import styled from './style.module.css';
import { resigterSubsUserAction } from '../../../../../store/slices/fakeUser/actions';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useUser } from '../../../../../providers/useUser';
const { useRef } = React;
const mainHeading = {
  marginBottom: '20px',
};

const AdminCreateSubscription = () => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const [packageType, setPackageType] = useState();
  const [noOfCoins, setNoOfCoins] = useState();
  const [amount, setAmount] = useState();
  const [bestSelling, setBestSelling] = useState(false);
  const [oneTime, setOneTime] = useState(false);
  const toggleChecked = () => setBestSelling((value) => !value);
  const { loggedInUser } = useUser();

  const user = loggedInUser;
  // const user = JSON.parse(localStorage.getItem('user'));

  const subscriptionHandleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      packageType,
      noOfCoins: parseInt(noOfCoins),
      amount: parseInt(amount),
      bestSelling,
      oneTime,
      creator: user.id,
    };

    dispatch(resigterSubsUserAction(payload))
      .then(unwrapResult)
      .then((result) => {
        formRef.current.reset();
      })
      .catch((error) => {});
  };

  return (
    <div>
      <Typography variant='h6' sx={mainHeading}>
        Dashboard {'>'} Create Subscription
      </Typography>
      <div className={styled.fromSUbscription}>
        <form
          ref={formRef}
          onSubmit={(e) => {
            subscriptionHandleSubmit(e);
          }}
        >
          <div className={styled.fromGroup}>
            <label>Package Name</label>
            <input type='text' onChange={(e) => setPackageType(e.target.value)} />
          </div>
          <div className={styled.fromGroup}>
            <label>No of coins</label>
            <input type='text' onChange={(e) => setNoOfCoins(e.target.value)} />
          </div>
          <div className={styled.fromGroup}>
            <label>Amount</label>
            <input type='text' onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className={styled.fromGroup}>
            <label>Best seller</label>
            <label className='toggle'>
              <input
                className={styled.toggle_checkbox}
                type='checkbox'
                checked={bestSelling}
                onChange={toggleChecked}
              />
              <div className={styled.toggle_switch}></div>
              <span className={styled.toggle_label}></span>
            </label>
          </div>
          <div className={styled.fromGroup}>
            <label>One Time</label>
            <label className='toggle'>
              <input
                className={styled.toggle_checkbox}
                type='checkbox'
                checked={oneTime}
                onChange={() => setOneTime(!oneTime)}
              />
              <div className={styled.toggle_switch}></div>
              <span className={styled.toggle_label}></span>
            </label>
          </div>

          <div className={styled.fromGroup}>
            <button>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateSubscription;

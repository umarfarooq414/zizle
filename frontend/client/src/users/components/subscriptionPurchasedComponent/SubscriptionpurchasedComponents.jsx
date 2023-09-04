import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from './style.module.css';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { paymentUserListAction } from '../../../store/slices/userAuth/actions';
import CircularProgress from '@mui/material/CircularProgress';

const SubscriptionComponents = () => {
  const [listData, setListData] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const paymentsListFetched = useRef(false);

  const dispatch = useDispatch();

  const fetchPaymentsList = useCallback(async () => {
    dispatch(paymentUserListAction())
      .then(unwrapResult)
      .then((result) => {
        setIsLoading(false);
        setListData(result.data);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    if (paymentsListFetched.current) return;
    paymentsListFetched.current = true;
    fetchPaymentsList();
  }, []);

  return (
    <div>
      <div className={styled.subscriptionUi}>
        <h3 className={styled.headingSubscrpt}>Purchased Subscriptions</h3>

        {isLoading ? (
          <CircularProgress color='secondary' style={{ marginLeft: '50%' }} />
        ) : (
          <>
            {listData.length !== 0 ? (
              <>
                {listData.map((userListData) => (
                  <>
                    <div className={styled.packagesList}>
                      <div className={styled.packages}>
                        <div className={styled.packageTitle}>
                          <h2>{userListData.packageName}</h2>
                          <p>€ {userListData.amount}</p>
                        </div>
                        <h3>{userListData.noOfCoins}</h3>
                        <Link className={styled.disabledlink}>Purchased</Link>
                      </div>
                    </div>
                  </>
                ))}
              </>
            ) : (
              <div className={styled.mydiv}>
                <div className={styled.mydiv2}>
                  <h1 className={styled.headingSubscrptionpurchase}>
                    Find Out Your Best <b>Subscription Plan !</b>
                  </h1>
                </div>
                <div className={styled.mydiv3}>
                  <p className={styled.paragraph}>
                    Online dating has become increasingly popular, and with so many dating websites
                    available, it can be difficult to know which one to choose. However, if you're
                    serious about finding a partner, then a subscription to a dating website is
                    definitely worth considering.
                  </p>
                </div>
                <div className={styled.header_btns}>
                  <Link to='/subscription'>Choose Plan</Link>
                </div>
                <div className={styled.clear}></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionComponents;

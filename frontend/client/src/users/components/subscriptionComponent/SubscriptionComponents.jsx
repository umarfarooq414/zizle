import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from './style.module.css';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  subscriptionsUserListAction,
  userCointransactionAction,
} from '../../../../src/store/slices/userAuth/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/fontawesome-free-solid';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import UserCoin from '../../../assets/images/coinuser.svg';
import DarkModeContext from '../../../providers/DarkModeContext';
import { useUser } from '../../../providers/useUser';
const SubscriptionComponents = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [listData, setListData] = useState('');
  const subscriptionsListFetched = useRef(false);
  const [bonus, setBonus] = useState();

  const dispatch = useDispatch();
  const { token } = useUser();
  const fetchUsersList = useCallback(async () => {
    dispatch(subscriptionsUserListAction())
      .then(unwrapResult)
      .then((result) => {
        setListData(result.data);
      })
      .catch((error) => { });
  }, []);

  useEffect(() => {
    if (subscriptionsListFetched.current) return;
    subscriptionsListFetched.current = true;
    fetchUsersList();
  }, []);

  const handleBonus = (e) => {
    e.preventDefault();
    const payload = {
      actionType: 'BonusCode',
      bonus: bonus,
    };
    dispatch(userCointransactionAction(payload))
      .then(unwrapResult)
      .then(() => {
        toast.success('Coins added successfully!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((error) => {
        toast.error('Bonus Code Invalid or Expired!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  return (
    // <div>
    <div className={styled.subscriptionUi}>
      <h3 className={styled.headingSubscrpt}>top up account</h3>
      <div className={styled.mainSubscriber}>
        <div className={styled.mainSubscriber1}>
          <div className={styled.mainSec}>
            <Link to='#'>
              <div className={styled.trailpkge}>
                <h3>Trail packege</h3>
                <p>
                  only <span>for</span> € 19.99
                </p>
                <p>you can only buy the pack once</p>
              </div>
              <div className={styled.trailpkgecoins}>
                <div className={styled.mainInnerSec}>
                  <div className={styled.sec1}>
                    <ul>
                      <li>132 coins</li>
                    </ul>
                  </div>
                  {/* <div className={styled.sec1}>coins</div> */}
                </div>
                <ul>
                  <li>
                    <h3>No subscription</h3>
                  </li>
                  <li>
                    <h3>No hidden costs</h3>
                  </li>
                </ul>
              </div>
              {/* <div className={styled.addpackagesCustom}>
                  <ul>
                    <li>+</li>
                    <li>+</li>
                    <li>+</li>
                  </ul>
                </div> */}
              <div className={styled.clear}></div>
            </Link>
          </div>
        </div>
        <div className={styled.mainSubscriber2}>
          <h3>Bonus code</h3>
          <p>If you have a bonus code you can enter it.</p>
          <form>
            <input
              type='text'
              placeholder='code here'
              onChange={(e) => setBonus(e.target.value)}
              style={{
                backgroundColor: isDarkMode ? '#0f0f0f' : '#fff',
                color: isDarkMode ? '#fff' : '#000',
              }}
            />

            <button onClick={(e) => handleBonus(e)}>
              <FontAwesomeIcon
                className={styled.sendIcon}
                icon={faPaperPlane}
                style={{ cursor: 'pointer', filter: isDarkMode ? 'invert(100%)' : 'none' }}
              />
            </button>
          </form>
        </div>
        <div className={styled.clear}></div>
      </div>
      <div className={styled.packagesMain}>
        <h3 className={styled.headingSubscrpt}>Other packages</h3>

        <div className={styled.mainSubSecList}>
          {listData && (
            <>
              {listData.map((userListData) => (
                <div
                  className={`${styled.packagesListres} ${isDarkMode ? styled.invertColors : ''}`}
                >
                  <div className={styled.packagesList}>
                    <div className={styled.packages}>
                      <div className={isDarkMode ? styled.packageTitleDark : styled.packageTitle}>
                        <h2>
                          {userListData.packageName}
                        </h2>
                        <div className={styled.oneTimeWrap}>
                          <span style={{ float: "right" }}>{userListData.oneTime ? '(One Time)' : null} </span>
                          <p>€ {userListData.amount}</p>
                        </div>
                      </div>
                      <h3>
                        {' '}
                        <img
                          src={UserCoin}
                          alt='coins'
                          style={{ verticalAlign: 'middle' }}
                        />{' '}
                        {userListData.noOfCoins} <span style={{ fontSize: '10px' }}>coins</span>{' '}
                      </h3>
                      <Link
                        to={`/payment-method-screen/?${new URLSearchParams({
                          id: userListData.id,
                          packageName: userListData.packageName,
                          noOfCoins: userListData.noOfCoins,
                          amount: userListData.amount,
                        }).toString()}`}
                        style={{
                          color: isDarkMode ? '#000' : '#fff',
                          backgroundColor: isDarkMode ? '#fff' : '#000',
                        }}
                      >
                        Choose
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <div className={styled.packagesMain}>
        <h3 className={styled.headingSubscrpt}>Paysafecard packages</h3>

        <div className={styled.mainSubSecList}>
          {listData && (
            <>
              {listData.map((userListData) => {
                return userListData.bestSelling ? (
                  <>
                    <div
                      className={`${styled.packagesListres} ${isDarkMode ? styled.invertColors : ''
                        }`}
                    >
                      <div className={styled.packagesList}>
                        <div className={styled.packages}>
                          <div
                            className={isDarkMode ? styled.packageTitleDark : styled.packageTitle}
                          >
                            <h4 style={{ margin: '0', textAlign: 'center', display: 'block' }}>
                              Best Seller
                            </h4>
                            <h2>{userListData.packageName}</h2>
                            <p>€ {userListData.amount}</p>
                          </div>
                          <h3>
                            {' '}
                            <img
                              src={UserCoin}
                              alt='coins'
                              style={{ verticalAlign: 'middle' }}
                            />{' '}
                            {userListData.noOfCoins}{' '}
                            <span style={{ fontSize: '10px' }}>coins</span>{' '}
                          </h3>

                          <Link
                            to={`https://paysafecard.micropayment.de/paysafecard/event/?project=14qp-vmylu-a504badb&testmode=1&theme=x2&bgcolor=ebebeb&title=mylovu&producttype=product&seal=d74fda6916457f5a94319981ccba5dfb&amount=${userListData.amount * 100
                              }&token=${token}&id=${userListData}`}
                            style={{
                              color: isDarkMode ? '#000' : '#fff',
                              backgroundColor: isDarkMode ? '#fff' : '#000',
                            }}
                          >
                            Choose
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  ''
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionComponents;

import React, { Fragment, useEffect, useRef, useState, useContext } from 'react';
import styled from './style.module.css';
// import UserProfile from "../../assets/images/userP.jpg"
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import UserFavourtiesIcon from '../../../assets/images/favourties_icon.svg';
import { profileVisitorList } from './../../../store/slices/customerAPI/action';
import {
  userCoinAction,
  userCoinCostAction,
  userCointransactionAction,
} from '../../../store/slices/userAuth/actions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import userP from '../../../assets/images/userP.jpg';
import treasure from '../../../assets/images/treasure2.png';
import CloseIcon from '../../../assets/images/navClose.png';
import { CircularProgress } from '@mui/material';

import { useUser } from '../../../providers/useUser';

import MaleAvatr from '../../../assets/images/male.png';
import FemaleAvatr from '../../../assets/images/female.png';
import ProfileLock from '../../../assets/images/profileLock.svg';
import DarkModeContext from '../../../providers/DarkModeContext';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: window.innerWidth <= 768 ? '275px' : '700px',
  height: '80vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  overflow: 'hidden',
  // overflowY: 'scroll',
  p: 4,
};
const ProfileVisit = () => {
  let navigate = useNavigate();
  const { isDarkMode } = useContext(DarkModeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [coinData, setCoinData] = useState([]);
  const profileVisitorsListFetched = useRef(false);
  const dispatch = useDispatch();
  const { token, blockedUser } = useUser();
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);


  function calculateAge(birthDateString) {
    var birthDate = new Date(birthDateString);
    var difference = Date.now() - birthDate.getTime();
    var ageDate = new Date(difference);
    var calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    return calculatedAge ? calculatedAge : '';
  }

  const handleUnlock = (id) => {
    const payload = {
      actionType: 'ViewPhoto',
      receiverId: id,
    };
    setIsLoading(true);
    dispatch(userCointransactionAction(payload))
      .then(unwrapResult)
      .then((result) => {
        dispatch(userCoinAction()).then(unwrapResult);
        if (result.data.success) {
          navigate(`/profile/${id}`);
        } else {
          setShowPopup(true);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setTransactionModalOpen(true);
        setIsLoading(false);

      });
  };

  const visitProfileList = () => {
    const payload = {
      token,
    };
    dispatch(profileVisitorList(payload))
      .then(unwrapResult)
      .then((result) => {
        setListData(result);
      })
      .catch((error) => {
        // setTransactionModalOpen(true);
      });
    dispatch(userCoinCostAction())
      .then(unwrapResult)
      .then((result) => {
        setCoinData(result);
      })
      .catch((error) => { });
  };

  useEffect(() => {
    if (profileVisitorsListFetched.current) return;
    profileVisitorsListFetched.current = true;
    visitProfileList();
  }, []);
  const firstHandleClose = () => {
    setTransactionModalOpen(false);
  };


  const filteredData = listData?.filter((listVisitedData) => {
    const blocked = blockedUser?.find((blockedUser) => blockedUser?.blocked?.id === listVisitedData?.visitor?.id);
    return blocked === undefined;
  });
  console.log("filteredData", filteredData[0]?.visitor?.selfGender)
  return (
    <Fragment>
      <div className={styled.ProfileVisitmain}>
        <div className={styled.ProfileVisitUpperDiv}>
          <h3>
            Find out <strong>who likes you</strong>
          </h3>
          <p>
            Du hast dabei die Wahl, ob du lieber einzelne, ausgewählte Profilbesucher für je 30 Tage
            freischalten möchtest, oder die komplette Liste für einen gewissen Zeitraum.
          </p>
          {/* <button>Unlock</button> */}
        </div>
        <div className={styled.giftBan}>
          <ul>
            <li style={{ listStyleType: 'none' }}>
              <Modal
                open={transactionModalOpen}
                onClose={firstHandleClose}
                aria-labelledby='parent-modal-title'
                aria-describedby='parent-modal-description'
              >
                <Box
                  sx={{
                    ...style,
                    width: window.innerWidth <= 768 ? '250px' : '360px',
                    overflowY: 'hidden',
                    height: '280px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    zIndex: '9999',
                  }}
                >
                  <Button
                    onClick={firstHandleClose}
                    sx={{
                      // backgroundColor: 'blue',
                      border: '1px solid #000',
                      borderRadius: '50%',
                      height: '20px',
                      width: '20px',
                      padding: '0',
                      float: 'right',
                      minWidth: 'auto',
                      position: 'absolute',
                      right: '10px',
                      top: '10px',
                      '&:hover': {
                        padding: '0',
                        borderRadius: '5px',
                        border: '1px solid #ff0000',
                        filter:
                          'invert(25%) sepia(98%) saturate(7483%) hue-rotate(359deg) brightness(100%) contrast(118%)',
                      },
                    }}
                  >
                    <img
                      src={CloseIcon}
                      alt='cross icon'
                      style={{
                        width: '8px',
                        textAlign: 'right',
                        filter:
                          'invert(0%) sepia(8%) saturate(7469%) hue-rotate(300deg) brightness(90%) contrast(110%)',
                      }}
                    />
                  </Button>
                  <img
                    style={{
                      height: '120px',
                      display: 'block',
                      margin: '10px auto 20px',
                    }}
                    src={treasure}
                    alt='cross icon'
                  />
                  <h2
                    style={{
                      textAlign: 'center',
                      color: 'rgba(0,0,0,.7)',
                      fontSize: '14px',
                      lineHeight: '20px',
                      margin: '0px 0px 10px;',
                    }}
                    id='parent-modal-title'
                  >
                    Fehler!
                  </h2>
                  <h4
                    style={{
                      textAlign: 'center',
                      color: '#9e9e9e',
                      fontSize: '14px',
                      lineHeight: '20px',
                      margin: '0px 0px 10px;',
                    }}
                    id='parent-modal-title'
                  >
                    Du hast nicht genügend Credits ({coinData?.data?.length > 0 && coinData?.data[6]?.cost})
                  </h4>
                  <Button
                    onClick={() => {
                      navigate('/subscription');
                    }}
                    sx={{
                      // backgroundColor: 'blue',
                      border: '1px solid #f99b5f',
                      borderRadius: '20px',
                      color: 'white',
                      fontWeight: 'bolder',
                      backgroundColor: '#f99b5f',
                      padding: '8px 30px',
                      transition: 'all 0.3s ease-in',
                      '&:hover': {
                        backgroundColor: '#f99b31',
                        padding: '8px 30px',
                        transform: 'scale(1.05)',
                        borderRadius: '40px',
                        transition: 'all 0.3s ease-in',
                      },
                    }}
                  >
                    Kaufe Münzen
                  </Button>
                </Box>
              </Modal>
            </li>
          </ul>
        </div>
        {filteredData?.length === 0 ? (
          <div className={styled.ProfileVisitMessage}>
            <img src={UserFavourtiesIcon} alt='a' />
            <p>Creepy, there&apos;s nothing here.</p>
          </div>
        ) : (
          filteredData?.map((user) => (
            <div className={styled.ProfileVisitInner}>
              {user?.seen === true ? (
                <Link to={`/profile/${user?.visitor?.id}`}>
                  <div className={styled.lockProfile}>
                    <div className={styled.imageMain} style={{ background: isDarkMode ? '#000' : '#fff' }}>
                      {/* {user?.seen ? (
                    <img src={user?.visitor.imgUrl} alt='' />
                  ) : (
                    <img src={userP} alt='' />
                  )} */}

                      {/* {user?.seen === false ? (
                        <img
                          src={user?.visitor?.profile?.avatarUrl}
                          alt=''
                          style={{ filter: 'blur(13px)' }}
                        />
                      ) : (
                        <img
                          src={`${user?.visitor?.profile?.avatarUrl}`}
                          alt=''
                          style={{ filter: 'blur(0)' }}
                        />
                      )} */}

                      {user?.seen === false ? (
                        !user?.visitor?.profile?.avatarUrl ? (
                          user?.visitor.selfGender === 'Male' ? (
                            <img src={MaleAvatr} alt='' style={{ filter: 'blur(13px)' }} />
                          ) : (
                            <img src={FemaleAvatr} alt='' style={{ filter: 'blur(13px)' }} />
                          )
                        ) : (
                          <img src={user?.visitor?.selfGender} alt='' style={{ filter: 'blur(13px)' }} />
                        )
                      ) : (
                        !user?.visitor?.profile?.avatarUrl ? (
                          user?.visitor?.profile?.avatarUrl === 'Male' ? (
                            <img src={MaleAvatr} alt='' style={{ filter: 'blur(0)' }} />
                          ) : (
                            <img src={FemaleAvatr} alt='' style={{ filter: 'blur(0)' }} />
                          )
                        ) : (
                          <img src={user?.visitor?.profile?.avatarUrl} alt='' style={{ filter: 'blur(0)' }} />
                        )
                      )}

                    </div>
                    {/* <div className={styled.locakProfileContent}>
                      {user?.seen === false ? (
                        <>
                          <div className={styled.lockImage}>
                            <img src={ProfileLock} alt='' />
                          </div>
                          <p>This account is private</p>

                          <button
                            onClick={() => handleUnlock(user?.visitor?.id)}
                            className={styled.unlockbtn}
                          >
                            Unlock | {coinData?.data?.length > 0 && -coinData?.data[6]?.cost} coins
                          </button>
                        </>
                      ) : (
                        <div className={styled.homeUserNewDetails}>
                          <h3>
                            {user?.visitor?.userName}{' , '}{calculateAge(user?.visitor?.profile?.dateOfBirth)}
                            <span>{calculateAge(user?.visitor?.dateOfBirth)}</span>
                          </h3>
                          <p> {user?.visitor?.address?.address}</p>
                        </div>

                      )}
                    </div> */}

                    {showPopup && (
                      <Popup open position='right center'>
                        <div className={styled.popup}>Not Enough Coins</div>
                      </Popup>
                    )}
                  </div>
                </Link>) : (
                <div className={styled.lockProfile}>
                  <div className={styled.imageMain} style={{ background: isDarkMode ? '#000' : '#fff' }}>
                    {/* {user?.seen ? (
                    <img src={user?.visitor.imgUrl} alt='' />
                  ) : (
                    <img src={userP} alt='' />
                  )} */}

                    {user?.seen === false ? (
                      !user?.visitor?.profile?.avatarUrl ? (
                        user?.visitor?.selfGender === 'Male' ? (
                          <img src={MaleAvatr} alt='' style={{ filter: 'blur(13px)' }} />
                        ) : (
                          <img src={FemaleAvatr} alt='' style={{ filter: 'blur(13px)' }} />
                        )
                      ) : (
                        <img src={user?.visitor?.profile?.avatarUrl} alt='' style={{ filter: 'blur(13px)' }} />
                      )
                    ) : (
                      !user?.visitor?.profile?.avatarUrl ? (
                        user?.visitor?.selfGender === 'Male' ? (
                          <img src={MaleAvatr} alt='' style={{ filter: 'blur(0)' }} />
                        ) : (
                          <img src={FemaleAvatr} alt='' style={{ filter: 'blur(0)' }} />
                        )
                      ) : (
                        <img src={user?.visitor?.profile?.avatarUrl} alt='' style={{ filter: 'blur(0)' }} />
                      )
                    )}

                  </div>
                  <div className={styled.locakProfileContent}>
                    {user?.seen === false ? (
                      <>
                        <div className={styled.lockImage}>
                          <img src={ProfileLock} alt='' />
                        </div>
                        <p>This account is private</p>

                        <button
                          onClick={() => handleUnlock(user?.visitor?.id)}
                          className={styled.unlockbtn}
                        >
                          Unlock | {coinData?.data?.length > 0 && -coinData?.data[6]?.cost} coins
                        </button>
                      </>
                    ) : (
                      <div className={styled.homeUserNewDetails}>
                        <h3>
                          {user?.visitor?.userName}{' , '}{calculateAge(user?.visitor?.profile?.dateOfBirth)}
                          <span>{calculateAge(user?.visitor?.dateOfBirth)}</span>
                        </h3>
                        <p> {user?.visitor?.address?.address}</p>
                      </div>
                    )}
                  </div>

                  {showPopup && (
                    <Popup open position='right center'>
                      <div className={styled.popup}>Not Enough Coins</div>
                    </Popup>
                  )}
                </div>
              )}
            </div>
          ))
        )}
        <div className={styled.clear}></div>
      </div>
    </Fragment >
  );
};

export default ProfileVisit;

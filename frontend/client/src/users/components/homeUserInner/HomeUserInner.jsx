import React, { useMemo, useRef, useContext } from 'react';
import { faBan, faGift, faPaperPlane, faUnlock } from '@fortawesome/fontawesome-free-solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SmileIcon from '@mui/icons-material/EmojiEmotions';
import HeartIcon from '@mui/icons-material/Favorite';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import UserVerified from '../../../assets/images/badgeIcon.svg';
import { useUser } from '../../../providers/useUser';
import DarkModeContext from '../../../providers/DarkModeContext';

import {
  addToBlockList,
  addToFavourite,
  blockedUsersListAction,
  favouriteUsersList,
  getUserByIdAction,
  removeFromBlockListAction,
  userGiftListAction,
} from '../../../store/slices/customerAPI/action';
import styled from './style.module.css';
import { useConnection } from '../../../socket/SocketConnection';
import {
  fetchEmojis,
  userCoinCostAction,
  userCointransactionAction,
} from '../../../store/slices/userAuth/actions';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { gifTransactionAction } from './../../../store/slices/customerAPI/action';
import { CircularProgress } from '@mui/material';
import MaleAvatr from '../../../assets/images/male.png';
import FemaleAvatr from '../../../assets/images/female.png';
import { MODAL_TYPES, useGlobalModalContext } from '../../../globalPopups/GlobalModal';
import treasure from '../../../assets/images/treasure2.png';
import CloseIcon from '../../../assets/images/navClose.png';
import { useNavigate } from 'react-router-dom';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: window.innerWidth <= 768 ? '275px' : '700px',
  height: '80vh',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  borderRadius: '15px',
  boxShadow: 24,
  // overflow: 'hidden',
  overflowY: 'scroll',
  p: 4,
};

const HomeUserInner = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  let navigate = useNavigate();
  const { transactionFailedState } = useSelector((state) => state.customerAPI);

  const [selectedUser, setSelectedUser] = useState();
  const [gifts, setGifts] = useState();

  const [refresh, setRefresh] = useState(false);
  const [listFavUser, setListFavUser] = useState([]);
  const [blockedList, setBlockedList] = useState([]);
  const [message, setMessage] = useState('');
  const { token, user, setBlockedUser, blockedUser } = useUser();
  const [coinData, setCoinData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEmoji, setIsLoadingEmoji] = useState(false);
  const [emojis, setEmojis] = useState(``);
  const [open, setOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [giftCost, setGiftCost] = useState();
  const favouritesListFetched = useRef(false);
  const [showSmile, setShowSmile] = useState(false);
  const [openGiftModal, setOpenGiftModal] = useState(false);
  const [emojiValue, setEmojiValue] = useState();
  const dispatch = useDispatch();

  function Modal({ open, children, onClose }) {
    if (!open) return null;

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(2px)',
          zIndex: '999',
        }}
      >
        <div
          style={{
            backgroundColor: 'transparent',
            padding: '1em',
            borderRadius: '8px',
            maxWidth: '100%',
            maxHeight: '100%',
            backdropFilter: 'blur(10px 3px)',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* <button onClick={onClose}>Close</button> */}
          {children}
        </div>
      </div>
    );
  }

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImageModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setModalOpen(false);
  };

  const visitProfiledata = (payload) => {
    setIsLoading(true);
    dispatch(getUserByIdAction(payload))
      .then(unwrapResult)
      .then((result) => {
        setSelectedUser(result);
        setIsLoading(false);
      })

      .catch((error) => {
        setIsLoading(false);
      });

    dispatch(userCoinCostAction())
      .then(unwrapResult)
      .then((result) => {
        setCoinData(result.data);
        setEmojiValue(result.data?.find((action) => action.actionType === 'SendEmoji'));
      })
      .catch((error) => {});
  };
  const id = useMemo(() => {
    const url = window.location.href;
    const regex = /\/profile\/?(.*)/;
    const match = url.match(regex);
    const id = match ? match[1] : '';
    visitProfiledata({
      id,
      token,
    });
    return id;
  }, [window.location.href]);

  const { sendMessage } = useConnection();

  const handleOpen = () => {
    setOpen(true);

    dispatch(userGiftListAction())
      .then(unwrapResult)
      .then((result) => {
        setGifts(result);
      })
      .catch((error) => {});
  };
  const handleClose = () => setOpen(false);

  function handleShowSmile() {
    setShowSmile(!showSmile);
    if (!showSmile && !emojis.length) {
      setIsLoadingEmoji(true);
      dispatch(fetchEmojis())
        .then(unwrapResult)
        .then((result) => {
          setIsLoadingEmoji(false);
          if (result.length) {
            setEmojis(result.reverse());
          } else {
            setShowPopup(true);
            setShowSmile(false);
          }
        })
        .catch((error) => {
          setIsLoadingEmoji(false);
        });
    }
  }
  function calculateAge(birthDateString) {
    var birthDate = new Date(birthDateString);
    var difference = Date.now() - birthDate.getTime();
    var ageDate = new Date(difference);
    var calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    return calculatedAge ? calculatedAge : '';
  }

  const payload = {
    id,
    token,
  };

  const handleGiftTransaction = (e, gift) => {
    setGiftCost(gift?.cost);
    e.preventDefault();
    const payload = {
      actionType: 'SendGift',
      receiverId: id,
      subAction: gift.actionType,
    };
    dispatch(gifTransactionAction(payload))
      .then(unwrapResult)
      .then((result) => {
        if (result.data.success) {
          onChatMessageHandler(e, gift?.imageUrl);
        }
      })
      .catch((error) => {
        setTransactionModalOpen(true);
      });
  };

  const handleEmojiTransaction = (e, emoji) => {
    e.preventDefault();
    const payload = {
      actionType: 'SendEmoji',
      receiverId: id,
    };
    dispatch(gifTransactionAction(payload))
      .then(unwrapResult)
      .then((result) => {
        if (result.data.success) {
          onChatMessageHandler(e, emoji);
        }
      })
      .catch((error) => {
        setTransactionModalOpen(true);
      });
  };

  const getfavProfileList = () => {
    const payload = {
      token,
    };
    dispatch(favouriteUsersList(payload))
      .then(unwrapResult)
      .then((result) => {
        setListFavUser(result.map((d) => d.favorites.id));
      })
      .catch((error) => {});
  };

  // blockedUsersList function

  const getBockedUsers = () => {
    const payload = {
      token,
    };
    dispatch(blockedUsersListAction(payload))
      .then(unwrapResult)
      .then((result) => {
        setBlockedList(result.map((d) => d.blocked.id));
        setBlockedUser(result);
      })
      .catch((error) => {});
  };

  const clickHandler = async () => {
    await dispatch(addToFavourite(payload));
    getfavProfileList();
  };

  const handleUnBlockClick = async () => {
    await dispatch(removeFromBlockListAction(payload));
    getBockedUsers();
  };

  const handleBlockClick = async () => {
    // setIsBlocked(false)
    await dispatch(addToBlockList(payload));
    getBockedUsers();
  };

  useEffect(() => {
    if (favouritesListFetched.current) return;
    favouritesListFetched.current = true;
    getfavProfileList();
    getBockedUsers();
  }, [blockedUser]);

  function getLikeStatus() {
    const favUser = listFavUser.find((u) => u === id);
    if (favUser) {
      return 'Unlike';
    }
    return 'I Like';
  }

  const getBlockedStatus = () => {
    const blockedUser = blockedList.find((u) => u === id);
    if (blockedUser) {
      return (
        <>
          <li onClick={handleUnBlockClick}>
            <FontAwesomeIcon
              icon={faUnlock}
              title='Un Block'
              style={{
                fontSize: '24px',
                ...(isDarkMode ? { filter: 'invert(93%)' } : null),
              }}
            />
          </li>
        </>
      );
    }

    return (
      <>
        <li onClick={handleBlockClick} style={{ cursor: 'pointer' }}>
          <FontAwesomeIcon
            icon={faBan}
            title='Block'
            style={{
              fontSize: '20px',
              ...(isDarkMode ? { filter: 'invert(93%)' } : null),
            }}
          />
        </li>
      </>
    );
  };

  const onChatMessageHandler = (e, attachment) => {
    // if(message)
    e.preventDefault();

    // if(!message)
    // if (!message.trim()) {
    //   return;
    // }
    const payload = {
      sender: user.id,
      message: message,
      seen: false,
      receiver: id,
    };

    if (message.trim().length > 0) {
      payload.message = message;
    }

    if (!payload.message && !attachment && !showSmile && !openGiftModal) {
      return;
    }

    if (attachment) {
      payload.attachments = attachment;
    }

    if (showSmile) {
      payload.smile = true;
    }

    if (openGiftModal) {
      payload.gift = true;
    }

    setShowSmile(false);
    setMessage(``);
    setOpen(false);
    sendMessage(payload);
  };

  const firstHandleClose = () => {
    setTransactionModalOpen(false);
  };

  return (
    <div>
      {isLoading ? (
        <CircularProgress color='secondary' style={{ marginLeft: '50%' }} />
      ) : (
        <>
          <div className={styled.mainInner}>
            <div className={styled.innerUserDetails}>
              <div
                className={styled.innerUserDetails1}
                style={isDarkMode ? { backgroundColor: '#1a1a1a', color: '#fff' } : null}
              >
                <div className={styled.innerUserDetailsLeft}>
                  {!selectedUser?.profile?.avatarUrl ? (
                    selectedUser?.selfGender === 'Male' ? (
                      <img src={MaleAvatr} alt='' />
                    ) : (
                      <img src={FemaleAvatr} alt='' />
                    )
                  ) : (
                    <img
                      src={`${selectedUser?.profile?.avatarUrl}`}
                      alt=''
                      onClick={() => openImageModal(selectedUser?.profile?.avatarUrl)}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                </div>
                <div className={styled.innerUserDetailsRight}>
                  <div className={styled.giftStatus}>
                    <div>
                      {selectedUser?.online ? (
                        <span className={styled.statusShow}>Online</span>
                      ) : (
                        <span className={styled.statusShowOff}>Offline</span>
                      )}

                      <div className={styled.userNameDiv}>
                        <h2>{selectedUser?.userName}</h2>
                        <img src={UserVerified} alt='' />
                        <div className={styled.clear}></div>
                      </div>
                    </div>

                    <div className={styled.giftBan}>
                      <ul>
                        <li>
                          <button
                            onClick={handleOpen}
                            style={{ background: 'transparent', cursor: 'pointer' }}
                          >
                            <FontAwesomeIcon
                              icon={faGift}
                              style={{
                                fontSize: '20px',
                                ...(isDarkMode ? { filter: 'invert(93%)' } : null),
                              }}
                            />
                          </button>
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
                                Du hast nicht genügend Credits ({emojiValue?.cost})
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
                          <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby='modal-modal-title'
                            aria-describedby='modal-modal-description'
                          >
                            <Box sx={style}>
                              <Typography
                                id='modal-modal-title'
                                variant='h6'
                                component='h2'
                                sx={{
                                  textAlign: 'center',
                                  marginBottom: '10px',
                                  fontSize: '24px',
                                  fontWeight: 'bold',
                                  letterSpacing: '-1px',
                                  width: '100%',
                                }}
                              >
                                Send gift
                              </Typography>
                              <Button
                                onClick={() => handleClose()}
                                className={styled.closeBtnModal}
                                style={{ background: 'transparent ' }}
                              >
                                <img
                                  src={CloseIcon}
                                  alt='cross icon'
                                  style={{
                                    background: 'transparent',
                                    ...(isDarkMode ? { filter: 'invert(80%)' } : null),
                                  }}
                                />
                              </Button>
                              <Box>
                                <ul className={styled.modelGiftsSection}>
                                  {gifts?.map((gifts, index) => (
                                    <li>
                                      <img
                                        src={`${gifts?.imageUrl}`}
                                        alt=''
                                        key={index}
                                        onClick={(e) => handleGiftTransaction(e, gifts)}
                                      />
                                      <h4>{-gifts?.cost} Coins</h4>
                                      <h2>{gifts?.actionType}</h2>
                                    </li>
                                  ))}
                                </ul>

                                {/* *********TransactionFailedModal************* */}

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
                                      Du hast nicht genügend Credits ({giftCost})
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

                                {/* ********************** */}
                              </Box>
                            </Box>
                          </Modal>
                        </li>
                        {getBlockedStatus()}
                      </ul>

                      <div className={styled.clear}></div>
                    </div>
                    {/* {selectedUser?.profile.isProfileVerified === 'VERIFIED' && (  */}

                    {/* )} */}
                  </div>
                  <form onSubmit={onChatMessageHandler}>
                    <div className={styled.reactbutton}>
                      <ul>
                        <li onClick={handleShowSmile}>
                          <Button
                            sx={{
                              borderColor: 'transparent',
                              borderRadius: '10px',
                              // width: '90px',
                              color: '#ffffff',
                              background: '#facc15',
                              ':hover': {
                                backgroundColor: '#ff7c6d',
                                color: 'white',
                                borderColor: 'transparent',
                              },
                            }}
                            variant='outlined'
                            startIcon={<SmileIcon />}
                          >
                            Smile
                          </Button>
                          {showSmile && (
                            <div className={styled.smileicons}>
                              {isLoadingEmoji ? (
                                <CircularProgress color='secondary' size={30} />
                              ) : (
                                emojis.length > 0 &&
                                emojis.map((emoji, index) => (
                                  <button
                                    onClick={(e) => handleEmojiTransaction(e, emoji)}
                                    key={index}
                                  >
                                    <img src={emoji} alt='emoji' />
                                  </button>
                                ))
                              )}
                              {showPopup && (
                                <Popup open position='right center'>
                                  <div className={styled.popup}>Not Enough Coins</div>
                                </Popup>
                              )}
                            </div>
                          )}
                        </li>
                        <li>
                          <Button
                            sx={{
                              borderColor: 'transparent',
                              borderRadius: '10px',
                              width: '110px',
                              color: '#ffffff',
                              background: '#db2777',
                              ':hover': {
                                backgroundColor: '#ff7c6d ', // theme.palette.primary.main
                                color: 'white',
                                borderColor: 'transparent',
                              },
                            }}
                            variant='outlined'
                            startIcon={<HeartIcon />}
                            onClick={clickHandler}
                          >
                            {getLikeStatus()}
                          </Button>
                        </li>
                      </ul>
                    </div>
                    <div className={styled.textMessages}>
                      <textarea
                        placeholder=''
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <button>
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </button>
                    </div>
                  </form>
                </div>
                <div className={styled.clear}></div>
                <div className={styled.personalDetails}>
                  <ul>
                    <li>
                      <h5>Gender</h5>
                      <p
                        className={styled.usreDetails}
                        style={isDarkMode ? { color: '#fff' } : null}
                      >
                        {selectedUser?.selfGender ? selectedUser?.selfGender : `-`}
                      </p>
                    </li>
                    <li>
                      <h5>Age</h5>
                      <p
                        className={styled.usreDetails}
                        style={isDarkMode ? { color: '#fff' } : null}
                      >
                        {selectedUser?.profile?.dateOfBirth
                          ? calculateAge(selectedUser?.profile?.dateOfBirth)
                          : `-`}
                      </p>
                    </li>
                    <li>
                      <h5>Relationship Status</h5>
                      <p
                        className={styled.usreDetails}
                        style={isDarkMode ? { color: '#fff' } : null}
                      >
                        {selectedUser?.profile?.relationshipStatus
                          ? selectedUser?.profile?.relationshipStatus
                          : `-`}
                      </p>
                    </li>
                    <li>
                      <h5>Children</h5>
                      <p
                        className={styled.usreDetails}
                        style={isDarkMode ? { color: '#fff' } : null}
                      >
                        {selectedUser?.profile?.children ? selectedUser?.profile?.children : `-`}
                      </p>
                    </li>
                    <li>
                      <h5>Life</h5>
                      <p
                        className={styled.usreDetails}
                        style={isDarkMode ? { color: '#fff' } : null}
                      >
                        {selectedUser?.profile?.life ? selectedUser?.profile?.life : `-`}
                      </p>
                    </li>
                    <li>
                      <h5>Smoker</h5>
                      <p
                        className={styled.usreDetails}
                        style={isDarkMode ? { color: '#fff' } : null}
                      >
                        {selectedUser?.profile?.smoker ? selectedUser?.profile?.smoker : `-`}
                      </p>
                    </li>
                    <li style={{ width: '50%', overFlow: 'hidden' }}>
                      <h5>Profile Text</h5>
                      <p
                        className={styled.usreDetails}
                        style={isDarkMode ? { color: '#fff' } : null}
                      >
                        {selectedUser?.profile?.profileText
                          ? selectedUser?.profile?.profileText
                          : '-'}
                      </p>
                    </li>
                    <li>
                      <h5>City</h5>
                      <p
                        className={styled.usreDetails}
                        style={isDarkMode ? { color: '#fff' } : null}
                      >
                        {selectedUser?.address?.address ? selectedUser?.address?.address : `-`}
                      </p>
                    </li>
                    {/* <li>
                  <h5>Zip code</h5>
                  <p className={styled.usreDetails} style={isDarkMode ? { color: '#fff' } : null}>
                    {selectedUser?.profile?.smoker ? selectedUser?.profile?.smoker : `-`}
                  </p>
                </li> */}
                  </ul>
                  <ul></ul>
                </div>
              </div>
              <div className={styled.clear}></div>
            </div>

            <div
              className={`${styled.innerUserDetails1} ${styled.innerUserBottom}`}
              style={isDarkMode ? { backgroundColor: '#1a1a1a' } : null}
            >
              <ul>
                <h3>Photos ( {selectedUser?.photos?.length} )</h3>
                {selectedUser?.photos?.map((userPhotos) => (
                  <li key={userPhotos.id}>
                    <img
                      src={`${userPhotos?.photos}`}
                      alt=''
                      onClick={() => openImageModal(userPhotos?.photos)}
                      style={{ cursor: 'pointer' }}
                    />
                  </li>
                ))}
              </ul>
              <Modal open={isModalOpen}>
                <button
                  data-dismiss='modal'
                  aria-label='Close'
                  onClick={closeImageModal}
                  className={styled.imagePreviewCloseBtnModal}
                >
                  <img src={CloseIcon} alt='cross icon' />
                  {/* <span aria-hidden='true'>&times;</span> */}
                </button>
                <img
                  src={selectedImage}
                  onClick={closeImageModal}
                  alt='Opened in modal'
                  style={{
                    maxWidth: '700px',
                    maxHeight: '700px',
                    // width: '100%',
                    height: 'auto',
                    margin: '0px auto',
                  }}
                />
              </Modal>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeUserInner;

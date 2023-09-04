/* eslint-disable react-hooks/rules-of-hooks */
import React, { Fragment, useState, useEffect, useRef, useMemo, useContext } from 'react';
import styled from './style.module.css';
import GiftIcon from '../../../assets/images/gift_icon.svg';
import BackButton from '../../../assets/images/back.png';
import DeleteChat from '../../../assets/images/deleteChat_icon.svg';
import ImageUploadChat from '../../../assets/images/imageUploadChat.svg';
import ClosePng from '../../../assets/images/close.png';
import ImageSmileChat from '../../../assets/images/imageSmileChat.svg';
import { useConnection } from '../../../socket/SocketConnection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/fontawesome-free-solid';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useNavigate, useParams } from 'react-router-dom';
import { gifTransactionAction, userGiftListAction } from '../../../store/slices/customerAPI/action';
import { Box, CircularProgress, Modal, Typography } from '@mui/material';
import { fetchEmojis } from '../../../store/slices/userAuth/actions';
import { useUser } from '../../../providers/useUser';
import Button from '@mui/material/Button';
import CloseIcon from '../../../assets/images/navClose.png';
import DeleteIcon from '../../../assets/images/deleteIcon.png';
import MaleAvatr from '../../../assets/images/male.png';
import FemaleAvatr from '../../../assets/images/female.png';
import ProfileImage from '../../../assets/images/profile_pic.jpg';
import DarkModeContext from '../../../providers/DarkModeContext';
import { Link } from 'react-router-dom';
import treasure from '../../../assets/images/treasure2.png';
import failed from '../../../assets/images/error.svg';
import { useMediaQuery } from '@material-ui/core';
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

const UserAnnoucement = (props) => {
  const isMobile = useMediaQuery('(max-width: 786px)');
  const imagePreviewStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fitContent',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    padding: 0,
    height: 'auto',
    width: isMobile ? '100%' : 'auto',
    maxWidth: isMobile ? '90%' : '100%',
    textAlign: 'center',
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);
  const chatHistoryRef = useRef(null);
  const [showSmile, setShowSmile] = useState(false);
  const [emojis, setEmojis] = useState(``);
  const [isLoading, setIsLoading] = useState(false);
  const [giftCost, setGiftCost] = useState();
  const [msgImage, setMsgImage] = useState(``);
  const [mediaAttachment, setMediaAttachment] = useState(``);
  const [openGiftModal, setOpenGiftModal] = useState(false);
  const [gifts, setGifts] = useState();
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [emptyMessage, setEmptyMessage] = useState(false);
  const navigate = useNavigate();

  const announcementId = useMemo(() => {
    const url = window.location.href;
    const regex = /\/userAnnoucements\/\?(.*)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }, [window.location.href]);

  const { sendMessage, messages, currentSelectedUser, setCurrentSelectedUser, moderatorIds } =
    useConnection();
  const dispatch = useDispatch();
  const { user } = useUser();
  const avatarImage = user?.profile?.avatarUrl;
  const [message, setMessage] = useState('');
  const handleGiftModal = () => {
    setOpenGiftModal(true);

    dispatch(userGiftListAction())
      .then(unwrapResult)
      .then((result) => {
        setGifts(result);
      })
      .catch((error) => {});
  };

  const handleGiftTransaction = (e, gift) => {
    setGiftCost(gift?.cost);
    e.preventDefault();
    const payload = {
      actionType: 'SendGift',
      receiverId: announcementId,
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
      receiverId: announcementId,
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

  const onChatMessageHandler = (e, attachment) => {
    e.preventDefault();

    const payload = {
      sender: user.id,
      receiver: announcementId,
      seen: false,
    };

    if (message.trim().length > 0) {
      payload.message = message;
    }
    // if (message.trim().length <= 0 || messages.attachments === null) {
    //   setEmptyMessage(true)
    // }
    if (
      !payload.message &&
      !attachment &&
      !mediaAttachment &&
      !showSmile &&
      !msgImage &&
      !openGiftModal
    ) {
      setEmptyMessage(true);
      return;
    }

    if (attachment) {
      payload.attachments = attachment;
    }

    if (mediaAttachment) {
      payload.attachments = mediaAttachment;
    }

    if (showSmile) {
      payload.smile = true;
    }

    if (msgImage) {
      payload.image = msgImage;
    }

    if (openGiftModal) {
      payload.gift = true;
    }

    setMessage('');
    setShowSmile(false);
    setMsgImage('');
    setMediaAttachment('');
    setOpenGiftModal('');

    // sending message now
    sendMessage(payload);
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  // useEffect(() => {
  //   chatHistoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  // }, [messages]);

  function handleShowSmile() {
    setShowSmile(!showSmile);
    if (!showSmile && !emojis.length) {
      setIsLoading(true);
      dispatch(fetchEmojis())
        .then(unwrapResult)
        .then((result) => {
          setIsLoading(false);
          if (result.length) {
            setEmojis(result.reverse());
          } else {
            setShowSmile(false);
          }
        })
        .catch((error) => {
          // setTransactionModalOpen(true);

          setIsLoading(false);
        });
    }
  }
  const firstHandleClose = () => {
    setTransactionModalOpen(false);
  };
  const emptyMessageClose = () => {
    setEmptyMessage(false);
  };

  const openImageModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setImageModalOpen(true);
  };
  const closeImageModal = () => {
    setSelectedImage(null);
    setImageModalOpen(false);
  };
  return (
    <Fragment>
      {!messages.length ? (
        <CircularProgress color='secondary' style={{ marginLeft: '50%' }} />
      ) : (
        <>
          <div className={styled.userAnnoucementChatright}>
            <div className={styled.farvChatDetails}>
              <div
                className={styled.farvChatDetailsHead}
                style={{ background: isDarkMode ? 'rgb(45, 42, 42)' : 'rgb(255, 255, 255' }}
              >
                <div className={styled.headl}>
                  <img
                    src={BackButton}
                    alt='back'
                    className={styled.backButton}
                    style={{ marginTop: '10px', filter: isDarkMode ? 'invert(1)' : 'invert(0)' }}
                    onClick={() => {
                      setCurrentSelectedUser(null);
                      navigate(`/userAnnoucements`);
                    }}
                  />
                  {currentSelectedUser?.role === 'CUSTOMER' ||
                  currentSelectedUser?.role === 'FAKE' ? (
                    <Link to={`/profile/${currentSelectedUser?.id}`}>
                      <div>
                        {!currentSelectedUser?.profile?.avatarUrl ? (
                          currentSelectedUser?.selfGender === 'Male' ? (
                            <img src={MaleAvatr} alt='' />
                          ) : (
                            <img src={FemaleAvatr} alt='' />
                          )
                        ) : (
                          <img src={`${currentSelectedUser?.profile?.avatarUrl}`} alt='' />
                        )}
                        <h2>{currentSelectedUser?.userName}</h2>
                      </div>
                    </Link>
                  ) : (
                    <div>
                      {/* <img
                    src={BackButton}
                    alt='back'
                    className={styled.backButton}
                    onClick={() => {
                      setCurrentSelectedUser(null);
                      navigate(`/userAnnoucements`);
                    }}
                  /> */}
                      {!currentSelectedUser?.profile?.avatarUrl ? (
                        currentSelectedUser?.selfGender === 'Male' ? (
                          <img src={MaleAvatr} alt='' />
                        ) : (
                          <img src={FemaleAvatr} alt='' />
                        )
                      ) : (
                        <img src={`${currentSelectedUser?.profile?.avatarUrl}`} alt='' />
                      )}
                      <h2>{currentSelectedUser?.userName}</h2>
                    </div>
                  )}
                </div>
                {currentSelectedUser?.role === 'CUSTOMER' ||
                currentSelectedUser?.role === 'FAKE' ? (
                  <>
                    <div className={styled.headr}>
                      <ul>
                        <li
                          onClick={() => {
                            if (!openGiftModal) handleGiftModal();
                          }}
                        >
                          <img
                            src={GiftIcon}
                            alt=''
                            style={{
                              maxWidth: '100%',
                              width: '30px',
                              marginRight: '30px',
                              filter: isDarkMode ? 'invert(100%)' : 'none',
                              cursor:'pointer'
                            }}
                          />

                          <Modal
                            open={openGiftModal}
                            onClose={() => setOpenGiftModal(false)}
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
                                  fontSize: '26px',
                                  fontWeight: '600',
                                }}
                              >
                                Send gift
                              </Typography>
                              <Button
                                onClick={() => setOpenGiftModal(false)}
                                className={styled.closeBtnModal}
                                style={{
                                  maxWidth: '100%',
                                  width: '22px',
                                  background: 'transparent',
                                  ...(isDarkMode ? { filter: 'invert(93%)' } : null),
                                }}
                              >
                                <img src={CloseIcon} alt='cross icon' />
                              </Button>

                              <Box>
                                <ul className={styled.modelGiftsSection}>
                                  {gifts?.map((gifts, index) => (
                                    <li>
                                      <img
                                        src={`${gifts?.imageUrl}`}
                                        alt=''
                                        key={'gift' + index}
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
                                          backgroundColor: 'none',
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
                                      Du hast nicht genügend Credits ({-giftCost})
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
                                          backgroundColor: 'none',
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
                                background: 'none',
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
                                  background: 'none',
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
                              Du hast nicht genügend Credits
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

                        {/* ************************Empty Messgae Modal************************** */}
                        <Modal
                          open={emptyMessage}
                          onClose={firstHandleClose}
                          aria-labelledby='parent-modal-title'
                          aria-describedby='parent-modal-description'
                        >
                          <Box
                            sx={{
                              ...style,
                              width: window.innerWidth <= 768 ? '250px' : '300px',
                              overflowY: 'hidden',
                              height: '160px',
                              borderRadius: '10px',
                              textAlign: 'center',
                              zIndex: '9999',
                            }}
                          >
                            <Button
                              onClick={emptyMessageClose}
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
                                background: '#fff',
                                right: '10px',
                                top: '10px',
                                '&:hover': {
                                  padding: '0',
                                  borderRadius: '5px',
                                  background: '#fff',

                                  // filter:
                                  //   'invert(25%) sepia(98%) saturate(7483%) hue-rotate(359deg) brightness(100%) contrast(118%)',
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
                                height: '50px',
                                display: 'block',
                                margin: '10px auto 20px',
                              }}
                              src={failed}
                              alt='cross icon'
                            />
                            <h2
                              style={{
                                textAlign: 'center',
                                color: 'rgba(0,0,0,.7)',
                                fontSize: '24px',
                                lineHeight: '20px',
                                margin: '0px 0px 10px;',
                              }}
                              id='parent-modal-title'
                            >
                              Failed!
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
                              Message not found
                            </h4>
                            {/* <Button
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
                                    </Button> */}
                          </Box>
                        </Modal>
                        {/* ************************************************** */}

                        {/* ***************Image preview modal****************** */}
                        <Modal open={isImageModalOpen}>
                          <Box sx={imagePreviewStyle}>
                            <Button
                              onClick={closeImageModal}
                              className={styled.imagePreviewCloseBtnModal}
                            >
                              <img src={CloseIcon} alt='cross icon' />
                            </Button>
                            <img
                              src={selectedImage}
                              className={styled.imagePreviewMod}
                              style={{
                                maxWidth: '700px',
                                maxHeight: '700px',
                                height: 'auto',
                                margin: '0px auto',
                                objectFit: 'cover',
                              }}
                            />
                          </Box>
                        </Modal>
                        {/* ********************************* */}

                        {/* <li>
                  <img src={DeleteIcon} alt=' ' style={{ maxWidth: '100%', width: '22px' }} />
                </li> */}
                      </ul>
                    </div>
                  </>
                ) : null}
                <div className={styled.clear}></div>
              </div>
              <div className={styled.farvChatDetailsBody}>
                <div className={styled.chat_history} ref={chatHistoryRef}>
                  <ul>
                    {messages?.map((message, index) => (
                      <li
                        className={announcementId === message.receiver ? styled.clear : ''}
                        key={'msg' + index}
                      >
                        {announcementId === message.sender ? (
                          <>
                            <div className={styled.message_data} style={{ textAlign: 'left' }}>
                              <div className={styled.leftMsgContainerL}>
                                {!currentSelectedUser?.profile?.avatarUrl ? (
                                  currentSelectedUser?.selfGender === 'Male' ? (
                                    <img src={MaleAvatr} alt='' />
                                  ) : (
                                    <img src={FemaleAvatr} alt='' />
                                  )
                                ) : (
                                  <img src={`${currentSelectedUser?.profile?.avatarUrl}`} alt='' />
                                )}
                              </div>
                              <div
                                className={`${styled.leftMsgContainerR} ${
                                  isDarkMode ? 'darkMode' : ''
                                }`}
                              >
                                {message?.attachments?.length > 0 ? (
                                  <div className={styled.chatMsgImg}>
                                    <img
                                      src={message.attachments[0]?.fileUrl}
                                      alt='img'
                                      onClick={() =>
                                        openImageModal(message.attachments[0]?.fileUrl)
                                      }
                                    />
                                  </div>
                                ) : (
                                  <p
                                    style={{
                                      backgroundColor: isDarkMode ? '#2d2a2a' : '#fff',
                                      color: isDarkMode ? '#fff' : '#000',
                                    }}
                                  >
                                    {message.message}
                                  </p>
                                )}

                                <span className={styled.message_data_time}>
                                  {new Date(message.createdAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          user.id === message.sender && (
                            <>
                              <div
                                className={styled.message_data}
                                style={{ textAlign: 'right', position: 'relative', right: '0px' }}
                              >
                                <div className={styled.rightMsgContainerR}>
                                  {avatarImage === null ? (
                                    <img src={ProfileImage} alt='' />
                                  ) : (
                                    <img src={avatarImage} alt='' />
                                  )}
                                </div>
                                <div className={styled.rightMsgContainerL}>
                                  {/* {message.attachments[0] && message.attachments?.length > 0 && (
                                    <div className={styled.chatMsgImg}>
                                      <img src={message.attachments[0]?.fileUrl} alt='img' />
                                    </div>
                                  )} */}

                                  {message?.attachments?.length > 0 ? (
                                    <div className={styled.chatMsgImg}>
                                      <img
                                        src={message.attachments[0]?.fileUrl}
                                        alt='img'
                                        onClick={() =>
                                          openImageModal(message.attachments[0]?.fileUrl)
                                        }
                                      />
                                    </div>
                                  ) : (
                                    <p
                                      style={{
                                        backgroundColor: isDarkMode ? '#2d2a2a' : '#fff',
                                        color: isDarkMode ? '#fff' : '#000',
                                      }}
                                    >
                                      {message.message}
                                    </p>
                                  )}

                                  <span>{new Date(message.createdAt).toLocaleString()}</span>
                                </div>
                              </div>
                            </>
                          )
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* create message section */}
              <div
                className={styled.farvChatDetailsFoot}
                style={{ background: isDarkMode ? 'rgb(45, 42, 42)' : 'rgb(255, 255, 255' }}
              >
                {currentSelectedUser?.role === 'CUSTOMER' ||
                currentSelectedUser?.role === 'FAKE' ? (
                  <form onSubmit={onChatMessageHandler}>
                    <div className={styled.farvChatDetailsFootl}>
                      <ul>
                        <li style={isDarkMode ? { background: 'transparent' } : null}>
                          {msgImage ? (
                            <img
                              src={ClosePng}
                              alt=''
                              onClick={() => {
                                setMsgImage('');
                                setMediaAttachment('');
                              }}
                              style={isDarkMode ? { filter: 'invert(100%)' } : null}
                            />
                          ) : (
                            <>
                              <input
                                type='file'
                                name='photoMessage'
                                className={styled.fileUploadInput}
                                accept='image/*'
                                onChange={(e) => {
                                  setMsgImage(URL.createObjectURL(e.target.files[0]));
                                  setMediaAttachment(e.target.files);
                                }}
                              />
                              <img
                                src={ImageUploadChat}
                                alt=''
                                style={
                                  isDarkMode ? { filter: 'invert(100%)', cursor: 'pointer' } : null
                                }
                              />
                            </>
                          )}
                          {msgImage && (
                            <div className={styled.giftsIcons}>
                              <img src={msgImage} alt='' />
                            </div>
                          )}
                        </li>
                        <li
                          onClick={handleShowSmile}
                          style={isDarkMode ? { background: 'transparent' } : null}
                        >
                          <img
                            src={ImageSmileChat}
                            alt=''
                            style={isDarkMode ? { filter: 'invert(100%)' } : null}
                          />
                          {showSmile && (
                            <div
                              className={styled.smileicons}
                              style={isDarkMode ? { filter: 'invert(100%)' } : null}
                            >
                              {isLoading ? (
                                <CircularProgress
                                  color='secondary'
                                  size={30}
                                  style={{ marginTop: '4px', marginLeft: '45%' }}
                                />
                              ) : (
                                emojis.length > 0 &&
                                emojis.map((emoji, index) => (
                                  <button
                                    onClick={(e) => handleEmojiTransaction(e, emoji)}
                                    key={index}
                                    style={{ background: 'transparent' }}
                                  >
                                    <img
                                      src={emoji}
                                      alt='emoji'
                                      style={isDarkMode ? { filter: 'invert(100%)' } : null}
                                    />
                                  </button>
                                ))
                              )}
                            </div>
                          )}
                        </li>

                        {/* <li>
                    <img src={ImageGifChat} alt='' />
                  </li> */}
                      </ul>
                    </div>
                    <div className={styled.farvChatDetailsFootas}>
                      <textarea
                        id='messageTexarea'
                        cols='2000'
                        value={message}
                        placeholder='Write a message...'
                        onChange={(e) => setMessage(e.target.value)}
                        style={
                          isDarkMode ? { backgroundColor: 'rgb(45, 42, 42)', color: '#fff' } : null
                        }
                      ></textarea>
                    </div>
                    <div className={styled.farvChatDetailsFootr}>
                      <ul>
                        <li>
                          <button style={{ background: 'none' }}>
                            <FontAwesomeIcon
                              className={styled.farvChatDetailsFootrbtn}
                              icon={faPaperPlane}
                              style={{
                                color: isDarkMode ? '#fff' : '#000',
                                cursor: 'pointer',
                              }}
                            />
                          </button>
                        </li>
                      </ul>
                    </div>

                    <div className={styled.clear}></div>
                  </form>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Fragment>
  );
};

export default UserAnnoucement;

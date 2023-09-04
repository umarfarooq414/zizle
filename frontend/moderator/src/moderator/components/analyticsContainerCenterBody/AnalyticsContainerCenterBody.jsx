import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faHeart } from '@fortawesome/fontawesome-free-solid';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchChat,
  getAllCategories,
  getImagesByCategory,
  userGiftListAction,
} from '../../../store/slices/moderatorApi/actions';
import { useConnection } from '../../../socket/SocketConnection';
import { unwrapResult } from '@reduxjs/toolkit';
import CloseIcon from '../../../assets/images/navClose.png';
import ClosePng from '../../../assets/images/close.png';
import ImageUploadChat from '../../../assets/images/imageUploadChat.svg';
import GiftIcon from '../../../assets/images/gift_icon.svg';
import { Box, CircularProgress, Modal, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useUser } from '../../../providers/useUser';
import { useMediaQuery } from '@material-ui/core';
import Button from '@mui/material/Button';
import UserFavourtiesIcon from '../../../assets/images/favourties_icon.svg';

const AnalyticsContainerCenterBody = () => {
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
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: '80vh',
    bgcolor: 'background.paper',
    borderRadius: '15px',
    boxShadow: 24,
    overflowY: 'scroll',
    p: 4,
    width: isMobile ? '100%' : '100%',
    maxWidth: isMobile ? '90%' : '50%',
  };
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const { fakeChatPartners } = useSelector((state) => state.moderatorApi);
  const chatHistoryRef = useRef(null);
  const [message, setMessage] = useState();
  const [msgImage, setMsgImage] = useState(``);
  const [mediaAttachment, setMediaAttachment] = useState(``);
  const [openGiftModal, setOpenGiftModal] = useState(false);
  const [openImagesModal, setOpenImagesModal] = useState(false);
  const [gifts, setGifts] = useState();
  const [categories, setCategories] = useState([]);
  const [allImages, setAllImages] = useState([]);
  const { selectedUserFromNotifications } = useUser();
  const [showImages, setShowImages] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const userFromNotificatopnId = useMemo(() => {
    const url = window.location.href;
    const regex = /\/userAnnoucements\/\?(.*)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }, [window.location.href]);

  const {
    sendMessage,
    messages,
    setMessages,
    selectedFakeConversationUser: { receiver, sender },
    blockedConversation,
    acknowledgeUnseenMessageCount,
    socket,
  } = useConnection();
  const dispatch = useDispatch();
  useEffect(() => {
    if (selectedUserFromNotifications?.receiver?.id !== undefined) {
      dispatch(
        fetchChat({
          senderId: selectedUserFromNotifications?.receiver?.id,
          receiverId: selectedUserFromNotifications?.sender?.id,
          // senderId: sender?.id,
          // receiverId: receiver?.id,
        }),
      )
        .then(unwrapResult)
        .then((result) => {
          setIsLoading(false);
          setMessages(result.chats);
        });
    }
    acknowledgeUnseenMessageCount(
      selectedUserFromNotifications?.sender?.id,
      selectedUserFromNotifications?.receiver?.id,
    );
  }, [selectedUserFromNotifications]);
  useEffect(() => {
    return () => {
      setMessages([]);
    };
  }, []);
  const openImageModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setImageModalOpen(true);
  };
  const closeImageModal = () => {
    setSelectedImage(null);
    setImageModalOpen(false);
  };
  const handleGiftModal = () => {
    setOpenGiftModal(true);

    dispatch(userGiftListAction())
      .then(unwrapResult)
      .then((result) => {
        setGifts(result);
      })
      .catch((error) => {});
  };
  const handleClose = () => setOpenGiftModal(false);
  const handleClose1 = () => setOpenImagesModal(false);

  const onChatMessageHandler = (e, image) => {
    const userId = JSON.parse(localStorage.getItem('user'));
    e.preventDefault();
    // if (sender?.id?.length && receiver?.id?.length) {
    const payload = {
      sender: selectedUserFromNotifications?.sender?.id,
      receiver: selectedUserFromNotifications?.receiver?.id,
      moderator: userId.id,
      message: message,
      seen: false,
    };

    if (mediaAttachment) {
      payload.attachments = mediaAttachment;
    }
    if (image) {
      payload.attachments = image;
    }

    sendMessage(payload);
    setMessage(``);
    setMediaAttachment(``);
    setMsgImage(``);
    setOpenGiftModal(``);
    setOpenImagesModal(false);
    // }
  };

  const handleOpenImageModel = () => {
    dispatch(getAllCategories())
      .then(unwrapResult)
      .then((result) => {
        setCategories(result);
      });
    setOpenImagesModal(true);
  };

  const reorderCategories = (categoryId) => {
    const updatedCategories = [...categories];
    const selectedIndex = updatedCategories.findIndex((category) => category.id === categoryId);
    if (selectedIndex !== -1) {
      const selectedCategory = updatedCategories.splice(selectedIndex, 1)[0];
      updatedCategories.unshift(selectedCategory);
    }
    return updatedCategories;
  };

  const orderedCategories = selectedCategoryId ? reorderCategories(selectedCategoryId) : categories;

  const handleGetImagesByCategory = (id) => {
    dispatch(getImagesByCategory(id))
      .then(unwrapResult)
      .then((result) => {
        setSelectedCategoryId(id);
        setAllImages(result);
      });
  };
  let allMessagesWithDetails = messages.map((message) => ({
    ...message,
    name:
      message.sender === selectedUserFromNotifications.sender.id
        ? selectedUserFromNotifications.sender.name
        : selectedUserFromNotifications.receiver.name,
    dateTime: new Date(message.createdAt).toLocaleString(),
  }));

  const filterImages = () => {
    let images = messages.filter(
      (message) => message.attachments && message.attachments.length > 0,
    );
    setShowImages(images);
  };
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  const filteredData = fakeChatPartners.filter((user) => {
    const realUser = messages.find((msg) => msg?.sender === user?.receiver?.id);
    return realUser;
  });

  return (
    <div className={styled.analyticsContainerCenterBody}>
      <div className={styled.buttonCenter1}>
        <ul>
          <li>
            <button onClick={() => setShowImages(false)}>Show All Messages</button>
          </li>
          <li>
            <button onClick={filterImages}>Show Pictures</button>
          </li>
        </ul>
      </div>
      <Modal open={isImageModalOpen}>
        <Box sx={imagePreviewStyle}>
          <Button onClick={closeImageModal} className={styled.imagePreviewCloseBtnModal}>
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
      <div className={`${styled.pageContent} ${styled.pageContainer}`} id={styled.pageContent}>
        <div className='padding'>
          <div
            className={`${styled.row} ${styled.container} ${styled.dFlex} ${styled.justifyContentCenter}`}
          >
            <div className={styled.colMd6}>
              <div className={`${styled.card} ${styled.cardBordered}`}>
                <div className={styled.cardHeader}></div>
                <div
                  className={`${styled.psContainer} ${styled.psThemeDefault} ${styled.psActiveY}`}
                  id={styled.chatContent}
                  style={{ overflowY: 'hidden' }}
                >
                  <div className={styled.farvChatDetailsBody}>
                    {isLoading === true && selectedUserFromNotifications !== null ? (
                      <CircularProgress color='secondary' style={{ marginLeft: '50%' }} />
                    ) : (
                      <>
                        <div className={styled.chat_history} ref={chatHistoryRef}>
                          {showImages?.length === 0 ? (
                            <div className={styled.ghostImg}>
                              <img src={UserFavourtiesIcon} alt='a' />
                              <p>Creepy, there&apos;s no images in this chat.</p>
                            </div>
                          ) : showImages?.length > 0 ? (
                            <ul>
                              {showImages?.map((message, index) => (
                                <li
                                  className={` ${
                                    selectedUserFromNotifications?.sender?.id === message?.sender
                                      ? styled.clear
                                      : ''
                                  }`}
                                  key={'msg' + index}
                                >
                                  {selectedUserFromNotifications?.sender?.id !== message?.sender ? (
                                    // right side messages
                                    <>
                                      {/* name */}
                                      <div
                                        className={styled.message_data}
                                        style={{ textAlign: 'right' }}
                                      >
                                        &nbsp; &nbsp;
                                        <i className={styled.circle_online}></i>
                                        <span className={styled.message_data_name}>
                                          {selectedUserFromNotifications?.receiver?.name}
                                        </span>
                                      </div>

                                      {/* message */}

                                      {message?.attachments?.length > 0 ? (
                                        <div
                                          className={`${styled.chatMsgImg} ${styled.chatMsgImgPosL}`}
                                        >
                                          <img
                                            src={message?.attachments[0]?.fileUrl}
                                            alt='img'
                                            onClick={() =>
                                              openImageModal(message?.attachments[0]?.fileUrl)
                                            }
                                          />
                                        </div>
                                      ) : (
                                        <div
                                          className={`${styled.message} ${
                                            receiver?.id === message?.sender
                                              ? styled.my_message
                                              : styled.other_message
                                          }`}
                                        >
                                          {message?.message}
                                        </div>
                                      )}

                                      {/* {selectedUserFromNotifications?.receiver?.id === message?.sender && (
                                          <>
                                            {message?.attachments?.length > 0 ? (
                                              <div className={styled.chatMsgImg}>
                                                <img src={message.attachments[0]?.fileUrl} alt='img' />
                                              </div>
                                            ) : (
                                              message?.message
                                            )}
                                          </>
                                        )}
 */}

                                      {/* date and time */}
                                      <span
                                        className={`${styled.message_data_time} ${styled.message_data_timeR}`}
                                      >
                                        {new Date(message.createdAt).toLocaleString()}
                                      </span>
                                    </>
                                  ) : (
                                    // left side messages
                                    selectedUserFromNotifications?.receiver?.id ===
                                      message?.receiver && (
                                      <>
                                        {/* name */}
                                        <div
                                          className={styled.message_data}
                                          style={{ textAlign: 'left' }}
                                        >
                                          <br />
                                          <i className={styled.circle_online}></i>
                                          <span className={styled.message_data_name}>
                                            {selectedUserFromNotifications?.sender?.name}
                                          </span>
                                          &nbsp; &nbsp;
                                        </div>

                                        {/* message */}

                                        {message?.attachments?.length > 0 ? (
                                          <div
                                            className={`${styled.chatMsgImg} ${styled.chatMsgImgPos}`}
                                          >
                                            <img
                                              src={message?.attachments[0]?.fileUrl}
                                              alt='img'
                                              onClick={() =>
                                                openImageModal(message?.attachments[0]?.fileUrl)
                                              }
                                            />
                                          </div>
                                        ) : (
                                          <div
                                            className={`${styled.message} ${
                                              selectedUserFromNotifications?.receiver?.id ===
                                              message?.receiver
                                                ? styled.my_message
                                                : styled.other_message
                                            }`}
                                          >
                                            {message?.message}
                                          </div>
                                        )}

                                        {/* date and time */}
                                        <span
                                          className={`${styled.message_data_time} ${styled.message_data_timeL}`}
                                        >
                                          {new Date(message?.createdAt).toLocaleString()}
                                        </span>
                                      </>
                                    )
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <ul>
                              {messages?.map((message, index) => (
                                <li
                                  className={` ${
                                    selectedUserFromNotifications?.sender?.id === message?.sender
                                      ? styled.clear
                                      : ''
                                  }`}
                                  key={'msg' + index}
                                >
                                  {selectedUserFromNotifications?.sender?.id !== message?.sender ? (
                                    // right side messages
                                    <>
                                      {/* name */}
                                      <div
                                        className={styled.message_data}
                                        style={{ textAlign: 'right' }}
                                      >
                                        &nbsp; &nbsp;
                                        <i className={styled.circle_online}></i>
                                        <span className={styled.message_data_name}>
                                          {selectedUserFromNotifications?.receiver?.name}
                                        </span>
                                      </div>

                                      {/* message */}

                                      {message?.attachments?.length > 0 ? (
                                        <div
                                          className={`${styled.chatMsgImg} ${styled.chatMsgImgPosL}`}
                                        >
                                          <img
                                            src={message.attachments[0]?.fileUrl}
                                            alt='img'
                                            onClick={() =>
                                              openImageModal(message?.attachments[0]?.fileUrl)
                                            }
                                          />
                                        </div>
                                      ) : (
                                        <div
                                          className={`${styled.message} ${
                                            receiver?.id === message?.sender
                                              ? styled.my_message
                                              : styled.other_message
                                          }`}
                                        >
                                          {message?.message}
                                        </div>
                                      )}

                                      {/* date and time */}
                                      <span
                                        className={`${styled.message_data_time} ${styled.message_data_timeR}`}
                                      >
                                        {new Date(message.createdAt).toLocaleString()}
                                      </span>
                                    </>
                                  ) : (
                                    // left side messages
                                    selectedUserFromNotifications?.receiver?.id ===
                                      message?.receiver && (
                                      <>
                                        {/* name */}
                                        <div
                                          className={styled.message_data}
                                          style={{ textAlign: 'left' }}
                                        >
                                          <br />
                                          <i className={styled.circle_online}></i>
                                          <span className={styled.message_data_name}>
                                            {selectedUserFromNotifications?.sender?.name}
                                          </span>
                                          &nbsp; &nbsp;
                                        </div>

                                        {/* message */}
                                        {message?.attachments?.length > 0 ? (
                                          <div
                                            className={`${styled.chatMsgImg} ${styled.chatMsgImgPos}`}
                                          >
                                            <img
                                              src={message?.attachments[0]?.fileUrl}
                                              alt='img'
                                              onClick={() =>
                                                openImageModal(message?.attachments[0]?.fileUrl)
                                              }
                                            />
                                          </div>
                                        ) : (
                                          <div
                                            className={`${styled.message} ${
                                              selectedUserFromNotifications?.receiver?.id ===
                                              message?.receiver
                                                ? styled.my_message
                                                : styled.other_message
                                            }`}
                                          >
                                            {message?.message}
                                          </div>
                                        )}

                                        {/* date and time */}
                                        <span
                                          className={`${styled.message_data_time} ${styled.message_data_timeL}`}
                                        >
                                          {new Date(message?.createdAt).toLocaleString()}
                                        </span>
                                      </>
                                    )
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <div className={styled.psScrollbarXRail} style={{ left: '0px', bottom: '0px' }}>
                    <div
                      className={styled.psScrollbarX}
                      tabIndex='0'
                      style={{ left: '0px', width: '0px' }}
                    ></div>
                  </div>
                  <div
                    className={styled.psScrollbarYRail}
                    style={{ top: '0px', height: '0px', right: '2px' }}
                  >
                    <div
                      className={styled.psScrollbarY}
                      tabIndex='0'
                      style={{ top: '0px', height: '2px' }}
                    ></div>
                  </div>
                </div>
                {!selectedUserFromNotifications?.blocked && messages?.length > 0 && (
                  <form className={`${styled.publisher} ${styled.bt1} ${styled.borderLight}`}>
                    <textarea
                      className={styled.publisherInput}
                      placeholder='Write something'
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                    <img
                      src={ImageUploadChat}
                      alt=''
                      className={styled.uploadImage}
                      onClick={() => {
                        handleOpenImageModel();
                      }}
                    />
                    <Modal
                      open={openImagesModal}
                      onClose={() => setOpenImagesModal(false)}
                      aria-labelledby='modal-modal-title'
                      aria-describedby='modal-modal-description'
                    >
                      <Box sx={style} className={styled.imageModal}>
                        <Typography
                          id='modal-modal-title'
                          variant='h6'
                          component='h2'
                          sx={{ textAlign: 'center', marginBottom: '10px', fontSize: '26px' }}
                        >
                          Mod Gallery
                        </Typography>
                        <Button
                          onClick={() => handleClose1()}
                          className={styled.closeBtnModal}
                          style={{ background: 'transparent ' }}
                        >
                          {' '}
                          <img
                            src={CloseIcon}
                            alt='cross icon'
                            style={{
                              background: 'transparent',
                            }}
                          />
                        </Button>
                        <Box>
                          <div style={{ display: 'flex', gap: 3, marginBottom: '15px' }}>
                            <div className={styled.categories}>
                              {orderedCategories?.map((category) => (
                                <div
                                  key={category.id}
                                  className={`${styled.categoriesCards} ${
                                    category.id === selectedCategoryId
                                      ? styled.selectedCategory
                                      : ''
                                  }`}
                                  onClick={() => handleGetImagesByCategory(category.id)}
                                  style={{
                                    display: 'flex',
                                    height: '80px',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '10px',
                                    backgroundColor:
                                      category.id === selectedCategoryId ? '#7166aa' : 'white',
                                    color: category.id === selectedCategoryId ? '#fff' : '#000',
                                  }}
                                >
                                  <p
                                    style={{
                                      fontSize: '16px',
                                      fontWeight: 'bold',
                                      marginBottom: '0',
                                    }}
                                  >
                                    {category.name}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <div className={styled.images}>
                              <Box>
                                <ul className={styled.modelGiftsSection}>
                                  {allImages.length
                                    ? allImages?.map((image, index) => (
                                        <li className={styled.imageModelSectionLi}>
                                          <img
                                            src={`${image?.url}`}
                                            alt=''
                                            key={'gift' + index}
                                            onClick={(e) => onChatMessageHandler(e, image?.url)}
                                          />
                                          <h4>{image?.cost}</h4>
                                          <h2>{image?.action}</h2>
                                        </li>
                                      ))
                                    : 'No image found'}
                                </ul>
                              </Box>
                            </div>
                          </div>
                        </Box>
                      </Box>
                    </Modal>

                    <img
                      src={GiftIcon}
                      alt=' '
                      onClick={() => {
                        if (!openGiftModal) handleGiftModal();
                      }}
                      style={{ cursor: 'pointer' }}
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
                          sx={{ textAlign: 'center', marginBottom: '10px', fontSize: '26px' }}
                        >
                          Gift Box
                        </Typography>
                        <Button
                          onClick={() => handleClose()}
                          className={styled.closeBtnModal}
                          style={{ background: 'transparent ' }}
                        >
                          {' '}
                          <img
                            src={CloseIcon}
                            alt='cross icon'
                            style={{
                              background: 'transparent',
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
                                  key={'gift' + index}
                                  onClick={(e) => onChatMessageHandler(e, gifts?.imageUrl)}
                                />
                                <h4 style={{ marginBottom: '7px' }}>
                                  {Math.abs(gifts.cost)} coins
                                </h4>
                                <h2>{gifts?.actionType}</h2>
                              </li>
                            ))}
                          </ul>
                        </Box>
                      </Box>
                    </Modal>
                    <button
                      className={`${styled.publisherBtn} ${styled.textInfo}`}
                      to=''
                      data-abc='true'
                      onClick={onChatMessageHandler}
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                  </form>
                )}
              </div>
              <div className={styled.chat_history}>
                {selectedUserFromNotifications?.blocked ? (
                  <h3>Dieser Chat ist vom Administrator blockiert</h3>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AnalyticsContainerCenterBody;

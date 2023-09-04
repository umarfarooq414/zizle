import React, { useEffect, useRef } from 'react';
import styled from './style.module.css';
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@mui/material/CircularProgress';
import defaultProfileImg from '../../../../../assets/images/userIcon.svg';
import tickedUser from '../../../../../assets/images/tickedUser.png';
import {
  faHeart,
  faPaperclip,
  faPaperPlane,
  faPlusSquare,
  faSmile,
  faTrash,
} from '@fortawesome/fontawesome-free-solid';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  emptyState,
  setFakeUserBulkId,
  setRealCustomerBulkId,
} from '../../../../../store/slices/adminAPI/adminApiSlice';
import {
  adminCustomerListAction,
  sendSpamMessagesAction,
} from './../../../../../store/slices/adminAPI/actions';
import { useUser } from '../../../../../providers/useUser';
import { style } from '@mui/system';

const mainHeading = {
  marginBottom: '50px',
};
const BulkMessages = () => {
  const [spamMessage, setSpamMessage] = useState('');
  const [messageArray, setMessageArray] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);

  // const [fakeSelectedUser, setFakeSelectedUser] = useState(null);
  const [realSelectedUser, setRealSelectedUser] = useState(null);
  const { userList, fakeUserBulkIds, realCustomerBulkIds, isLoading } = useSelector(
    (state) => state.adminApi,
  );
  console.log("realCustomerBulkIds", realCustomerBulkIds.length)
  const { token,loggedInUser } = useUser();
  const fakeSelectedUser = JSON.parse(localStorage.getItem('user'));
  const bulkMessagePageRendered = useRef(false);

  const dispatch = useDispatch();
  const payload = {
    token: token,
  };

  useEffect(() => {
    if (bulkMessagePageRendered.current) return;
    bulkMessagePageRendered.current = true;
    dispatch(adminCustomerListAction(payload));
  }, []);

  function calculateAge(birthDateString) {
    var birthDate = new Date(birthDateString);
    var difference = Date.now() - birthDate.getTime();
    var ageDate = new Date(difference);
    var calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    return calculatedAge ? calculatedAge : '';
  }
  const fakeIds = [...new Set(fakeUserBulkIds?.map((user) => user?.id))];
  const realIds = [...new Set(realCustomerBulkIds?.map((user) => user?.id))];
  const formData = new FormData();
  function handleImageChange(e) {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
      setImage(e.target.files[0]);
    }
  }
  const handleClick = (e) => {
    e.preventDefault();
    const payload = {
      fakeUserIds: loggedInUser?.id,
      customerUserIds: realIds,
      message: spamMessage,
    };

    formData.append('fakeUserIds', payload.fakeUserIds);
    formData.append('customerUserIds', payload.customerUserIds);
    formData.append('message', payload.message);
    if (image) {
      formData.append('image', image);
      payload.image = image;
    }
    dispatch(sendSpamMessagesAction(formData));
    // dispatch(emptyState());

    setSpamMessage('');

    const newMessageArray = [...messageArray, spamMessage];
    if (image) {
      newMessageArray.push({ image: selectedImage });
    }
    setImage(null);
    setMessageArray(newMessageArray);
    setSelectedImage(null);
  };
  const handleUploadClick = (e) => {
    e.preventDefault();
    document.querySelector('.file-upload').click();
  };

  return (
    <>
      <Typography variant='h6' sx={mainHeading}>
        Dashboard {'>'} Send Support Message
      </Typography>

      <div className={styled.containerBody}>
        <div className={styled.containerBodyLeft}>
          <div className={styled.profileActive}>
            <div className={styled.profileActiveLeft}>
              {fakeSelectedUser?.profile?.avatarUrl ? (
                <img src={fakeSelectedUser?.profile?.avatarUrl} alt='loading' />
              ) : (
                <img src={defaultProfileImg} alt='loading' />
              )}
              <div className={styled.userActiveProfile}>
                <h3>
                  <span>{fakeSelectedUser?.profile?.age}</span>
                </h3>
                <h5 style={{ marginTop: "10px" }}>
                  {fakeSelectedUser?.userName}{' '}
                  <span>{calculateAge(fakeSelectedUser?.profile?.dateOfBirth)}</span>
                </h5>
              </div>
              <div className={styled.clear}></div>
            </div>
            <div className={styled.profileActiveright}>
              <label>{fakeSelectedUser?.online ? 'online' : 'offline'}</label>
            </div>
            <div className={styled.clear}></div>
          </div>
          {/* ***** */}
          {/* <div className={styled.profileActiveUser}> */}
          {/* ***** */}
          {/* <input
              className={styled.customCheckbox}
              type='checkbox'
              id='myCheckbox'
              onClick={() => {
                const allUsersSelected =
                  fakeUserBulkIds?.length ===
                  userList?.filter((user) => user?.role === 'FAKE')?.length;

                userList
                  ?.filter((user) => user?.role === 'FAKE')
                  ?.forEach((user) => {
                    if (allUsersSelected) {
                      dispatch(setFakeUserBulkId({ ...user, selected: false }));
                    } else if (!fakeUserBulkIds?.some((fakeUser) => fakeUser?.id === user?.id)) {
                      dispatch(setFakeUserBulkId({ ...user, selected: true }));
                    }
                  });
              }}
              checked={
                fakeUserBulkIds?.length > 0 &&
                fakeUserBulkIds?.length ===
                  userList?.filter((user) => user?.role === 'FAKE')?.length
              }
            />
            <label>
              <u>
                <h3>Select all users</h3>
              </u>
            </label> */}
          {/* ***** */}
          {/* <div className={styled.profileActiveMember}> */}
          {/* ******* */}
          {/* {isLoading && <CircularProgress color='secondary' style={{ marginLeft: 'none' }} />}
              {currentAdmin && (
                <button
                  className={styled.imageButton}
                  key={currentAdmin?.id}
                  onClick={() => {
                    setFakeSelectedUser((prevUser) =>
                      prevUser === currentAdmin ? null : currentAdmin,
                    );
                    dispatch(setFakeUserBulkId(currentAdmin));
                  }}
                >
                  {fakeUserBulkIds?.some((fakeUser) => fakeUser?.id === currentAdmin?.id) ? (
                    <img src={tickedUser} alt='loading' />
                  ) : (
                    <img
                      src={
                        currentAdmin?.profile?.avatarUrl
                          ? currentAdmin?.profile?.avatarUrl
                          : defaultProfileImg
                      }
                      alt='loading'
                    />
                  )}
                  <p style={{ marginTop: 20 }}> {currentAdmin?.userName}</p>
                </button>
              )} */}
          {/* {userList?.length !== 0 && (
                <>
                  {userList
                    ?.filter((user) => user?.role === 'FAKE')
                    ?.map((user) => (
                      <button
                        className={styled.imageButton}
                        key={user?.id}
                        onClick={() => {
                          setFakeSelectedUser((prevUser) => (prevUser === user ? null : user));
                          dispatch(setFakeUserBulkId(user));
                        }}
                      >
                        {fakeUserBulkIds?.some((fakeUser) => fakeUser?.id === user?.id) ? (
                          <img src={tickedUser} alt='loading' />
                        ) : (
                          <img
                            src={
                              user?.profile?.avatarUrl
                                ? user?.profile?.avatarUrl
                                : defaultProfileImg
                            }
                            alt='loading'
                          />
                        )}
                        <p style={{ marginTop: 20 }}> {user?.userName}</p>
                      </button>
                    ))}
                </>
              )} */}
          {/* </div>
          </div> */}
          <div className={styled.clear}></div>
        </div>
        <div className={styled.containerBodyCenter}>
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
                      style={{ overflowY: 'scroll', height: '500px' }}
                    >
                      <div className={`${styled.media} ${styled.mediaMetaDay}`}>Today</div>
                      <div
                        className={`${styled.media} ${styled.mediaChat} ${styled.mediaChatReverse}`}
                      >
                        <div>
                          {messageArray?.map((message, index) => (
                            <ul>
                              <li>
                                <div className={`${styled.mediaBody}`} key={index}>
                                  {typeof message === 'string' && <p> {message}</p>}

                                  {typeof message === 'object' && (
                                    <img src={`data:image;base64${message.image}`} alt={''} />
                                  )}
                                </div>
                              </li>
                            </ul>
                          ))}
                        </div>
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

                    <div className={`${styled.publisher} ${styled.bt1} ${styled.borderLight}`}>
                      <img
                        className='avatar avatar-xs'
                        src='https://img.icons8.com/color/36/000000/administrator-male.png'
                        alt='...'
                      />
                      <textarea
                        className={styled.publisherInput}
                        placeholder='Write something'
                        value={spamMessage}
                        onChange={(e) => setSpamMessage(e.target.value)}
                      ></textarea>
                      <span className={`${styled.publisherBtn} ${styled.fileGroup}`}>
                        <FontAwesomeIcon icon={faPaperclip} onClick={handleUploadClick} />
                        <input
                          type='file'
                          className='file-upload'
                          onChange={(e) => handleImageChange(e)}
                          style={{ display: 'none' }}
                        />
                      </span>
                      {/* <Link className={styled.publisherBtn} to='' data-abc='true'>
                        <FontAwesomeIcon icon={faSmile} />
                      </Link> */}
                      <Link
                        className={`${styled.publisherBtn} ${styled.textInfo}`}
                        to=''
                        data-abc='true'
                      >
                        <FontAwesomeIcon icon={faPaperPlane} onClick={(e) => handleClick(e)} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styled.containerBodyright}>
          {realCustomerBulkIds?.length <= 1 ? (
            <div className={styled.profileActive}>
              <div className={styled.profileActiveLeft}>
                {realSelectedUser?.profile?.avatarUrl ? (
                  <img src={realSelectedUser?.profile?.avatarUrl} alt='loading' />
                ) : (
                  <img src={defaultProfileImg} alt='loading' />
                )}
                {!realSelectedUser && (
                  <p style={{ marginTop: "10px" }}>Selected real user section</p>
                )}
                <div className={styled.userActiveProfile}>
                  <h3>
                    <span>{realSelectedUser?.profile?.age}</span>
                  </h3>
                  <h5>{realSelectedUser?.userName}</h5>
                </div>
                <div className={styled.clear}></div>
              </div>
              <div className={styled.profileActiveright}>
                <label>{realSelectedUser?.online ? 'online' : 'offline'}</label>
              </div>
              <div className={styled.clear}></div>
            </div>
          ) : (
            <div className={styled.selectedCount}>
              <h3>{realCustomerBulkIds?.length} users selected</h3>
            </div>
          )}


          <div className={styled.profileActiveUser}>
            <input
              className={styled.customCheckbox}
              type='checkbox'
              id='myCheckbox'
              onClick={() => {
                const allUsersSelected =
                  realCustomerBulkIds?.length ===
                  userList?.filter((user) => user?.role === 'CUSTOMER')?.length;

                userList
                  ?.filter((user) => user?.role === 'CUSTOMER')
                  ?.forEach((user) => {
                    if (allUsersSelected) {
                      dispatch(setRealCustomerBulkId({ ...user, selected: false }));
                    } else if (
                      !realCustomerBulkIds?.some((fakeUser) => fakeUser?.id === user?.id)
                    ) {
                      dispatch(setRealCustomerBulkId({ ...user, selected: true }));
                    }
                  });
              }}
              checked={
                realCustomerBulkIds?.length > 0 &&
                realCustomerBulkIds?.length ===
                userList?.filter((user) => user?.role === 'CUSTOMER')?.length
              }
            />
            <label>
              <u>
                <h3>Select all users</h3>
              </u>
            </label>
            <div className={styled.profileActiveMember}>
              {isLoading && <CircularProgress color='secondary' style={{ marginLeft: 'none' }} />}
              {userList?.length !== 0 && (
                <>
                  {userList
                    ?.filter((user) => user?.role === 'CUSTOMER')
                    ?.map((user) => (
                      <button
                        className={styled.imageButton}
                        key={user?.id}
                        onClick={() => {
                          setRealSelectedUser((prevUser) => (prevUser === user ? null : user));
                          dispatch(setRealCustomerBulkId(user));
                        }}
                      >
                        {realCustomerBulkIds?.some((fakeUser) => fakeUser?.id === user?.id) ? (
                          <img src={tickedUser} alt='loading' />
                        ) : (
                          <img
                            src={
                              user?.profile?.avatarUrl
                                ? user?.profile?.avatarUrl
                                : defaultProfileImg
                            }
                            alt='loading'
                          />
                        )}
                        <p style={{ marginTop: 20 }}> {user?.userName}</p>
                      </button>
                    ))}
                </>
              )}
            </div>
          </div>
          <div className={styled.clear}></div>
        </div>
        <div className={styled.clear}></div>
      </div>
    </>
  );
};

export default BulkMessages;

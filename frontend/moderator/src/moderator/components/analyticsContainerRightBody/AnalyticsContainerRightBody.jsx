import React, { useEffect, useMemo, useRef } from 'react';
import styled from './style.module.css';
import ProfileImage from '../../../assets/images/profile_image.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faSearch,
  faUser,
  faTrash,
  faMapMarker,
} from '@fortawesome/fontawesome-free-solid';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import {
  createNotesAction,
  deleteNoteAction,
  getCustomerNoteAction,
  modCustomerListAction,
  updateNoteAction,
} from '../../../store/slices/moderatorApi/actions';
import { setRealCustomerId } from '../../../store/slices/moderatorApi/moderatorApiSlice';
import { setRealCustomerBulkId } from '../../../store/slices/moderatorApi/moderatorApiSlice';
import tempUserImg from '../../../assets/images/userIcon.svg';
import CloseIcon from '../../../assets/images/navClose.png';
import tickedUser from '../../../assets/images/tickedUser.png';
import { useConnection } from '../../../socket/SocketConnection';
import { useLocation } from 'react-router-dom';
import { useUser } from '../../../providers/useUser';
import Button from '@mui/material/Button';
import { Box, CircularProgress, Modal, Typography } from '@mui/material';
import { useMediaQuery } from '@material-ui/core';

const AnalyticsContainerRightBody = () => {
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
  const location = useLocation();
  const { realCustomerBulkIds, fakeChatPartners } = useSelector((state) => state.moderatorApi);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const {
    userList,
    customerNote: { data: notesByCustomerId },
    realCustomerId,
    fakeUserId,
  } = useSelector((state) => state.moderatorApi);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [notes, setNotes] = useState('');
  const { onlineUsers, setOnlineUsers, userCount } = useConnection();
  const { loggedInUser, selectedUserFromNotifications } = useUser();
  const chatHistoryRef = useRef(null);
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
  useEffect(() => {
    dispatch(modCustomerListAction());
  }, []);
  const duplicateOnlineUsers = userList.filter((u) => u.online).concat(onlineUsers);
  const distinctOnlineUsers = duplicateOnlineUsers
    ? [...new Map(duplicateOnlineUsers.map((m) => [m.id, m])).values()]
    : [];
  const combinedUsers = onlineUsers?.concat(userList);
  function calculateAge(birthDateString) {
    var birthDate = new Date(birthDateString);
    var difference = Date.now() - birthDate.getTime();
    var ageDate = new Date(difference);
    var calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    return calculatedAge ? calculatedAge : '';
  }

  function handleNotesChange(event) {
    setNotes(event.target.value);
  }

  const users = useMemo(() => {
    if (userList?.length) {
      const userWithNoCount = [];
      const userWithCount = [];
      if (userCount?.length > 0) {
        userCount?.forEach((count) => {
          userList.filter((user) => {
            if (user.id === count.userId) {
              userWithCount.push(user);
            } else {
              userWithNoCount.push(user);
            }
          });
        });
        return [...new Set([...userWithCount, ...userWithNoCount])];
      } else {
        return userList;
      }
    }
  }, [userList, userCount]);

  const handleNotesSubmit = () => {
    const payload = {
      note: notes,
      creator: loggedInUser?.id,
      userId: selectedUser?.id,
      noteId: notesByCustomerId[0]?.id,
    };

    if (notesByCustomerId?.length === 0) {
      dispatch(createNotesAction(payload)).then(() => {
        dispatch(getCustomerNoteAction(selectedUser?.id));
      });
    } else {
      dispatch(updateNoteAction(payload)).then(() => {
        dispatch(getCustomerNoteAction(selectedUser?.id));
      });
    }
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  });

  const handleDeleteNote = async () => {
    const payload = {
      noteId: notesByCustomerId[0]?.id,
    };
    await dispatch(deleteNoteAction(payload));
    dispatch(getCustomerNoteAction(selectedUser?.id));
  };

  return (
    <div className={styled.analyticsContainerRightBody}>
      {/* <div className={styled.profileActive}>
        <div className={styled.profileActiveLeft}>
          {console.log('selectedUser', selectedUser)}
          {selectedUser?.profile?.avatarUrl ? (
            <img src={selectedUser?.profile?.avatarUrl} alt='loading' />
          ) : (
            <img src={tempUserImg} alt='loading' />
          )}
          <div className={styled.userActiveProfile}>
            <h3>
              {selectedUser?.userName}{' '}
              <span>{calculateAge(selectedUser?.profile?.dateOfBirth)}</span>
            </h3>
            <h5>user</h5>
          </div>
          <div className={styled.clear}></div>
        </div>
        {selectedUser && (
          <div className={styled.profileActiveright}>
            <label>{selectedUser?.online ? 'online' : 'offline'}</label>
          </div>
        )}
        <div className={styled.clear}></div>
      </div> */}

      <Modal open={isModalOpen}>
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

      <div className={styled.profileActive}>
        <div className={styled.profileActiveLeft}>
          {selectedUserFromNotifications?.receiver?.avatar ? (
            <img
              src={selectedUserFromNotifications?.receiver?.avatar}
              alt='loading'
              onClick={() => openImageModal(selectedUserFromNotifications?.receiver?.avatar)}
            />
          ) : (
            <img src={tempUserImg} alt='loading' />
          )}
          <div className={styled.userActiveProfile}>
            <h3>
              {/* {fakeChatPartners[0]?.receiver?.name}{' '} */}
              {selectedUserFromNotifications?.receiver?.name}{' '}
            </h3>
          </div>
          <div className={styled.clear}></div>
        </div>
        <div className={styled.profileActiveright}>
          <label>
            {selectedUserFromNotifications?.receiver?.receiver?.online ? 'online' : 'offline'}
          </label>
        </div>
        <div className={styled.clear}></div>
      </div>

      <div className={styled.activeprofileGallery}>
        <ul>
          {selectedUserFromNotifications?.receiver?.receiver?.photos?.map((photosGallery) => (
            <li>
              {/* {console.log('fakeChatPartners', photosGallery?.photos)} */}
              <img
                src={photosGallery?.photos}
                alt=''
                onClick={() => openImageModal(photosGallery?.photos)}
                style={{ cursor: 'pointer' }}
              />
            </li>
          ))}

          {/* ))} */}
        </ul>
      </div>

      {/* <div className={styled.profileActiveUser}>
        {location?.pathname === '/visit-fake-users' && (
          <>
            <input
              className={styled.customCheckbox}
              type='checkbox'
              id='myCheckbox'
              onClick={() => {
                const allUsersSelected =
                  realCustomerBulkIds?.length ===
                  users?.filter((user) => user?.role === 'CUSTOMER')?.length;

                users
                  ?.filter((user) => user?.role === 'CUSTOMER')
                  .forEach((user) => {
                    if (allUsersSelected) {
                      dispatch(setRealCustomerBulkId({ ...user, selected: false }));
                    } else if (!realCustomerBulkIds.some((realUser) => realUser.id === user.id)) {
                      dispatch(setRealCustomerBulkId({ ...user, selected: true }));
                    }
                  });
              }}
              checked={
                realCustomerBulkIds?.length > 0 &&
                realCustomerBulkIds?.length ===
                  users?.filter((user) => user?.role === 'CUSTOMER')?.length
              }
            />
            <label>
              {' '}
              <u>
                <h3>Select all users</h3>
              </u>
            </label>
          </>
        )}
        <div className={styled.profileActiveMember}>
          {isLoading ? (
            <CircularProgress color='secondary' style={{ marginLeft: '50%' }} />
          ) : (
            <>
              {users
                ?.filter((user) => user?.role === 'CUSTOMER')
                .map((user) => (
                  <button
                    className={styled.imageButton}
                    key={user.id}
                    onClick={() => {
                      setSelectedUser((prevUser) => (prevUser === user ? null : user));
                      dispatch(getCustomerNoteAction(user.id));
                      dispatch(setRealCustomerBulkId(user));
                    }}
                  >
                    {realCustomerBulkIds.some((realUser) => realUser.id === user.id) ||
                    realCustomerId === user.id ? (
                      <>
                        <img src={tickedUser} alt='loading' />
                        <span className={styled.user_name}>
                          {user.userName} &nbsp;
                          {distinctOnlineUsers?.some(
                            (onlineUser) => onlineUser.id === user?.id,
                          ) && (
                            <span className={styled.statusShow}>
                              <span></span>
                            </span>
                          )}
                        </span>
                      </>
                    ) : (
                      <>
                        <img
                          src={user?.profile?.avatarUrl ? user?.profile?.avatarUrl : tempUserImg}
                          alt='loading'
                        />
                        {userCount?.length > 0 &&
                          userCount.map(
                            (count) =>
                              count.userId === user.id && (
                                <span className={styled.countNumber}>{count.count}</span>
                              ),
                          )}
                        <span className={styled.user_name}>
                          {user.userName} &nbsp;
                          {distinctOnlineUsers?.some(
                            (onlineUser) => onlineUser.id === user?.id,
                          ) && (
                            <span className={styled.statusShow}>
                              <span></span>
                            </span>
                          )}
                        </span>
                      </>
                    )}
                  </button>
                ))}
            </>
          )}
        </div>
      </div> */}

      <div className={styled.profileActiveUserDetails}>
        <ul>
          <li>
            <FontAwesomeIcon icon={faUser} />
            <h3>
              Name:{' '}
              <span>
                {selectedUserFromNotifications?.receiver?.name
                  ? selectedUserFromNotifications?.receiver?.name
                  : 'N/A'}
              </span>
            </h3>
          </li>
          <li>
            <FontAwesomeIcon icon={faMapMarker} />
            <h3>
              Lives in:{' '}
              <span>
                {selectedUserFromNotifications?.receiver?.receiver?.address?.address
                  ? selectedUserFromNotifications?.receiver?.receiver?.address?.address
                  : 'N/A'}
              </span>
            </h3>
          </li>
          <li>
            <FontAwesomeIcon icon={faSearch} />
            <h3>
              Looking for:{' '}
              <span>
                {selectedUserFromNotifications?.receiver?.receiver?.interestedGender
                  ? selectedUserFromNotifications?.receiver?.receiver?.interestedGender
                  : 'N/A'}
              </span>
            </h3>
          </li>
          <li>
            <FontAwesomeIcon icon={faCalendar} />
            <h3>
              Birthday:{' '}
              <span>
                {selectedUserFromNotifications?.receiver?.receiver?.profile?.dateOfBirth
                  ? calculateAge(
                      selectedUserFromNotifications?.receiver?.receiver?.profile?.dateOfBirth,
                    )
                  : 'N/A'}
              </span>
            </h3>
          </li>

          <li>
            <FontAwesomeIcon icon={faUser} />
            <h3>
              Relationship Status:{' '}
              <span>
                {selectedUserFromNotifications?.receiver?.receiver?.profile?.relationshipStatus
                  ? selectedUserFromNotifications?.receiver?.receiver?.profile?.relationshipStatus
                  : 'N/A'}
              </span>
            </h3>
          </li>
          {/* <li>
            <FontAwesomeIcon icon={faUser} />
            <h3>
              Height:{' '}
              <span>{selectedUser?.profile?.smoker ? selectedUser?.profile?.smoker : 'N/A'}</span>
            </h3>
          </li> */}
          <li>
            <FontAwesomeIcon icon={faUser} />
            <h3>
              Life:{' '}
              <span>
                {selectedUserFromNotifications?.receiver?.receiver?.profile?.life
                  ? selectedUserFromNotifications?.receiver?.receiver?.profile?.life
                  : 'N/A'}
              </span>
            </h3>
          </li>
          <li>
            <FontAwesomeIcon icon={faUser} />
            <h3>
              Children:{' '}
              <span>
                {selectedUserFromNotifications?.receiver?.receiver?.profile?.children
                  ? selectedUserFromNotifications?.receiver?.receiver?.profile?.children
                  : 'N/A'}
              </span>
            </h3>
          </li>

          <li>
            <FontAwesomeIcon icon={faUser} />
            <h3>
              Smoker:{' '}
              <span>
                {selectedUserFromNotifications?.receiver?.receiver?.profile?.smoker
                  ? selectedUserFromNotifications?.receiver?.receiver?.profile?.smoker
                  : 'N/A'}
              </span>
            </h3>
          </li>
          {/* <li>
            <FontAwesomeIcon icon={faUser} />
            <h3>
              Alchole:{' '}
              <span>
                {selectedUser?.profile?.children ? selectedUser?.profile?.children : 'N/A'}
              </span>
            </h3>
          </li> */}
          {/* <li>
            <FontAwesomeIcon icon={faUser} />
            <h3>
              Occupation:{' '}
              <span>
                {selectedUser?.profile?.children ? selectedUser?.profile?.children : 'N/A'}
              </span>
            </h3>
          </li> */}
          {/* <li>
            <FontAwesomeIcon icon={faUser} />
            <h3>
              School:{' '}
              <span>
                {selectedUser?.profile?.children ? selectedUser?.profile?.children : 'N/A'}
              </span>
            </h3>
          </li> */}
          <li>
            <FontAwesomeIcon icon={faCalendar} />
            <h3>
              Registered:{' '}
              <span>
                {selectedUserFromNotifications?.receiver?.receiver?.createdAt
                  ? new Date(
                      selectedUserFromNotifications?.receiver?.receiver?.createdAt,
                    ).toLocaleString()
                  : 'N/A'}
              </span>
            </h3>
          </li>
          <li>
            <FontAwesomeIcon icon={faUser} />
            <h3>
              Bio:{' '}
              <span>
                {selectedUserFromNotifications?.receiver?.receiver?.profile?.profileText
                  ? selectedUserFromNotifications?.receiver?.receiver?.profile?.profileText
                  : 'N/A'}
              </span>
            </h3>
          </li>
          {/* <li>
            <FontAwesomeIcon icon={faUser} />
            <h3>
              Quote:{' '}
              <span>
                {selectedUser?.profile?.children ? selectedUser?.profile?.children : 'N/A'}
              </span>
            </h3>
          </li> */}
          {/* <li>
            <FontAwesomeIcon icon={faUser} />
            <h3>
              Character:{' '}
              <span>
                {selectedUser?.profile?.children ? selectedUser?.profile?.children : 'N/A'}
              </span>
            </h3>
          </li> */}
        </ul>
      </div>
      <div className={styled.profileActiveUserAdd}>
        {/* <form>
          <div className={styled.formModratorGroup}>
            <input type='text' name='profession' placeholder='Profession' />
          </div>
          <div className={styled.formModratorGroup}>
            <input type='text' name='Status' placeholder='Status' />
          </div>
          <div className={styled.formModratorGroup}>
            <input type='text' name='Name' placeholder='Name' />
          </div>
          <div className={styled.formModratorGroup}>
            <input type='text' name='location' placeholder='Location' />
          </div>
          <div className={styled.formModratorGroup}>
            <input type='text' name='siblings' placeholder='Siblings' />
          </div>
          <div className={styled.formModratorGroup}>
            <input type='text' name='children' placeholder='Children' />
          </div>
          <div className={styled.formModratorGroup}>
            <input type='text' name='house_animals' placeholder='House animals' />
          </div>
          <div className={styled.formModratorGroup}>
            <input type='text' name='hobbies' placeholder='Hobbies' />
          </div>
          <div className={styled.formModratorGroup}>
            <input type='text' name='star_sign' placeholder='Star sign' />
          </div>
          <div className={styled.formModratorGroup}>
            <button>Save</button>
          </div>
        </form> */}
        <form>
          <div className={styled.formModratorGroup}>
            <textarea placeholder='Notes' value={notes} onChange={handleNotesChange}></textarea>
          </div>

          <div className={styled.formModratorGroup}>
            <button
              onClick={(event) => {
                event.preventDefault();
                handleNotesSubmit();
              }}
            >
              Save
            </button>
            <div className={styled.formModratorGroup}>
              <br />
              {selectedUser ? (
                notesByCustomerId?.length > 0 ? (
                  <p>
                    <h2>
                      {' '}
                      <u>Note for this user</u>
                    </h2>
                    <h3>
                      <br />
                      <span className={styled.iconContainer}>
                        <FontAwesomeIcon icon={faTrash} onClick={handleDeleteNote} />
                      </span>{' '}
                      <span className={styled.noteText}>{notesByCustomerId[0]?.note}</span>
                    </h3>
                  </p>
                ) : (
                  <h3>No notes found for this user.</h3>
                )
              ) : (
                ''
              )}
            </div>
          </div>
        </form>
      </div>

      {/* <div className={styled.profileActiveUserModerator}>
        <div className={styled.profileActive1}>
          <div className={styled.profileActiveLeft}>
            <img src={ProfileImage} alt='' />
            <div className={styled.userActiveProfile}>
              <h3>Moderator</h3>
              <h5>Moderator</h5>
            </div>
            <div className={styled.clear}></div>
          </div>
          <div className={styled.clear}></div>
        </div>

        <div className={styled.avtiveModerator}>
          <ul>
            <li>
              <h3>Coins (in)</h3>
              <h4>0</h4>
            </li>
            <li>
              <h3>Coins (out)</h3>
              <h4>0</h4>
            </li>
            <li>
              <h3>Active Chats</h3>
              <h4>7</h4>
            </li>
            <li>
              <h3>Offline Asa</h3>
              <h4>1</h4>
            </li>
          </ul>
          <button>Save</button>
          <ul style={{ display: 'none' }}>
            <li>
              <h3>Coins (in)</h3>
              <h4>0</h4>
            </li>
            <li>
              <h3>Coins (out)</h3>
              <h4>0</h4>
            </li>
            <li>
              <h3>Active Chats</h3>
              <h4>7</h4>
            </li>
            <li>
              <h3>Offline Asa</h3>
              <h4>1</h4>
            </li>
          </ul>
        </div>
      </div> */}
    </div>
  );
};
export default AnalyticsContainerRightBody;

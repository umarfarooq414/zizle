import React, { useEffect, useMemo } from 'react';
import styled from './style.module.css';
import ProfileImage from '../../../assets/images/profile_image.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faSearch, faUser, faTrash } from '@fortawesome/fontawesome-free-solid';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import {
  createNotesAction,
  deleteNoteAction,
  getCustomerNoteAction,
  modCustomerListAction,
  updateNoteAction,
} from '../../../store/slices/moderatorApi/actions';
import CircularProgress from '@mui/material/CircularProgress';
import { setRealCustomerId } from '../../../store/slices/moderatorApi/moderatorApiSlice';
import { setRealCustomerBulkId } from '../../../store/slices/moderatorApi/moderatorApiSlice';
import tempUserImg from '../../../assets/images/userIcon.svg';
import tickedUser from '../../../assets/images/tickedUser.png';
import { useConnection } from '../../../socket/SocketConnection';
import { useLocation } from 'react-router-dom';
import { useUser } from '../../../providers/useUser';

const ViewContainerRightBody = () => {
  const location = useLocation();
  const { realCustomerBulkIds } = useSelector((state) => state.moderatorApi);
  const [selectedUser, setSelectedUser] = useState(null);
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
  const { loggedInUser } = useUser();
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

  const handleDeleteNote = async () => {
    const payload = {
      noteId: notesByCustomerId[0]?.id,
    };
    await dispatch(deleteNoteAction(payload));
    dispatch(getCustomerNoteAction(selectedUser?.id));
  };

  // const handleUser = (user) => {
  //   if (user?.id !== selectedUser?.id && user?.id !== realCustomerId) {
  //     setSelectedUser((prevUser) => (prevUser === user ? null : user));
  //     dispatch(getCustomerNoteAction(user.id));
  //     dispatch(setRealCustomerId(user.id))
  //     if (location?.pathname === "/visit-fake-users") {
  //       dispatch(setRealCustomerBulkId(user));
  //     }
  //   }
  // }
  return (
    <div className={styled.analyticsContainerRightBody}>
      {realCustomerBulkIds?.length <= 1 ? (
        <div className={styled.profileActive}>
          <div className={styled.profileActiveLeft}>
            {selectedUser?.profile?.avatarUrl ? (
              <img src={selectedUser?.profile?.avatarUrl} alt='loading' />
            ) : (
              <img src={tempUserImg} alt='loading' />
            )}
            {!selectedUser && (
              <p>Selected real users section</p>
            )}
            <div className={styled.userActiveProfile}>
              <h3>
                {selectedUser?.userName}{' '}
                <span>{calculateAge(selectedUser?.profile?.dateOfBirth)}</span>
              </h3>
              {/* <h5>user</h5> */}
            </div>
            <div className={styled.clear}></div>
          </div>
          {selectedUser && (
            <div className={styled.profileActiveright}>
              <label>{selectedUser?.online ? 'online' : 'offline'}</label>
            </div>
          )}
          <div className={styled.clear}></div>
        </div>
      ) : (
        <div className={styled.selectedCount}>
          <h3>{realCustomerBulkIds?.length} users selected</h3>
        </div>
      )}


      <div className={styled.profileActiveUser}>
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
        {/* <div className={styled.profileActiveMember}> */}
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
        {/* </div> */}
      </div>

      <div className={styled.profileActiveUserDetails}>
        <ul>
          <li>
            <FontAwesomeIcon icon={faUser} />
            <h3>
              Name: <span>{selectedUser?.userName}</span>
            </h3>
          </li>
          <li>
            <FontAwesomeIcon icon={faUser} />
            <h3>
              Gender: <span>{selectedUser?.selfGender ? selectedUser?.selfGender : 'N/A'}</span>
            </h3>
          </li>
          <li>
            <FontAwesomeIcon icon={faSearch} />
            <h3>
              Interested In:{' '}
              <span>{selectedUser?.interestedGender ? selectedUser?.interestedGender : 'N/A'}</span>
            </h3>
          </li>
          <li>
            <FontAwesomeIcon icon={faCalendar} />
            <h3>
              Dob:{' '}
              <span>
                {selectedUser?.profile?.dateOfBirth
                  ? calculateAge(selectedUser?.profile?.dateOfBirth)
                  : 'N/A'}
              </span>
            </h3>
          </li>

          <li>
            <FontAwesomeIcon icon={faCalendar} />
            <h3>
              Relationship Status:{' '}
              <span>
                {selectedUser?.profile?.relationshipStatus
                  ? selectedUser?.profile?.relationshipStatus
                  : 'N/A'}
              </span>
            </h3>
          </li>
          <li>
            <FontAwesomeIcon icon={faCalendar} />
            <h3>
              Smoke:{' '}
              <span>{selectedUser?.profile?.smoker ? selectedUser?.profile?.smoker : 'N/A'}</span>
            </h3>
          </li>
          <li>
            <FontAwesomeIcon icon={faCalendar} />
            <h3>
              Life: <span>{selectedUser?.profile?.life ? selectedUser?.profile?.life : 'N/A'}</span>
            </h3>
          </li>
          <li>
            <FontAwesomeIcon icon={faCalendar} />
            <h3>
              Children:{' '}
              <span>
                {selectedUser?.profile?.children ? selectedUser?.profile?.children : 'N/A'}
              </span>
            </h3>
          </li>
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
export default ViewContainerRightBody;

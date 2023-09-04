import React, { useCallback, useEffect, useMemo } from 'react';
import styled from './style.module.css';
import ProfileImage from '../../../assets/images/profile_image.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/fontawesome-free-solid';
import {
  faCalendar,
  faComment,
  faCopyright,
  faExclamationTriangle,
  faMapMarker,
  faSearch,
  faUser,
} from '@fortawesome/fontawesome-free-solid';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { createNotesAction, deleteNoteAction, getCustomerNoteAction, getFakeUserNoteAction, modCustomerListAction, updateNoteAction } from '../../../store/slices/moderatorApi/actions';
import { setFakeUserBulkId } from '../../../store/slices/moderatorApi/moderatorApiSlice';
import CircularProgress from '@mui/material/CircularProgress';
import tempUserImg from '../../../assets/images/userIcon.svg'
import tickedUser from '../../../assets/images/tickedUser.png'
import { setFakeCustomerId } from '../../../store/slices/moderatorApi/moderatorApiSlice';
import { useConnection } from '../../../socket/SocketConnection';
import { useLocation } from 'react-router-dom';
import { useUser } from '../../../providers/useUser';


const FakeUsers = () => {
  const { userList, unseenFakeIds, fakeUserBulkIds, fakeUserNote: { data: notesByFakesId }, fakeUserId } = useSelector((state) => state.moderatorApi)
  const loggedInUserId = JSON.parse(localStorage.getItem('user'));
  const [selectedUser, setSelectedUser] = useState(null)
  // const token = localStorage.getItem('token')
  const { token } = useUser()
  const dispatch = useDispatch()
  const [notes, setNotes] = useState('');
  const { setCurrentSelectedUser, currentSelectedUser } = useConnection()
  const location = useLocation()
  const payload = {
    token: token,
  };

  useEffect(() => {
    dispatch(modCustomerListAction(payload))
  }, []);


  const users = useMemo(() => {
    if (userList?.length && unseenFakeIds?.length) {
      const userWithNoCount = []
      const userWithCount = []
      unseenFakeIds.forEach((id) => {
        userList.filter((user) => {
          if (user.id === id) {
            userWithCount.push(user)
          } else {
            userWithNoCount.push(user)
          }
        })
      })
      return [...new Set([...userWithCount, ...userWithNoCount])]
    } else {
      return userList
    }
  }, [userList])

  function handleNotesChange(event) {
    setNotes(event.target.value);
  }

  const handleNotesSubmit = () => {
    const payload = {
      note: notes,
      creator: loggedInUserId?.id,
      userId: selectedUser?.id,
      noteId: notesByFakesId[0]?.id,
    };

    if (notesByFakesId?.length === 0) {
      dispatch(createNotesAction(payload)).then(() => {
        dispatch(getFakeUserNoteAction(selectedUser?.id));
      });
    } else {
      dispatch(updateNoteAction(payload)).then(() => {
        dispatch(getFakeUserNoteAction(selectedUser?.id));
      });
    }
  };

  function calculateAge(birthDateString) {
    var birthDate = new Date(birthDateString);
    var difference = Date.now() - birthDate.getTime();
    var ageDate = new Date(difference);
    var calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    return calculatedAge ? calculatedAge : '';
  }

  const handleDeleteNote = async () => {
    const payload = {
      noteId: notesByFakesId[0]?.id,
    };
    await dispatch(deleteNoteAction(payload));
    dispatch(getFakeUserNoteAction(selectedUser?.id));
  };
  useEffect(() => {
    if (selectedUser) {
      dispatch(getFakeUserNoteAction(selectedUser?.id));
    }
  }, [selectedUser, dispatch]);

  // const handleUser = (user) => {
  //   if (user?.id !== selectedUser?.id && user?.id !== currentSelectedUser?.id && user?.id !== fakeUserId) {
  //     setSelectedUser((prevUser) => (prevUser === user ? null : user));
  //     setCurrentSelectedUser(user)
  //     dispatch(getCustomerNoteAction(user.id));
  //     dispatch(setFakeCustomerId(user.id))
  //     if (location?.pathname === "/visit-fake-users") {
  //       dispatch(setFakeUserBulkId(user));
  //     }
  //   }
  // }
  return (
    <div className={styled.analyticsContainerleftBody}>
      {fakeUserBulkIds?.length <= 1 ? (
        <div className={styled.profileActive}>
          <div className={styled.profileActiveLeft}>
            <img src={selectedUser?.profile?.avatarUrl ? selectedUser?.profile?.avatarUrl : tempUserImg} alt="loading" />
            {!selectedUser && (
              <p>Selected fake users section</p>
            )}
            <div className={styled.userActiveProfile}>
              <h3>
                {selectedUser?.userName} <span>{calculateAge(selectedUser?.profile?.dateOfBirth)}</span>
              </h3>
              <h5>{selectedUser?.userName}</h5>
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
          <h3>{fakeUserBulkIds?.length} users selected</h3>
        </div>
      )}



      <div className={styled.profileActiveUser}>
        {location?.pathname === "/visit-fake-users" &&
          <>
            <input
              className={styled.customCheckbox}
              type="checkbox"
              id="myCheckbox"
              onClick={() => {
                const allUsersSelected =
                  fakeUserBulkIds?.length === users?.filter((user) => user?.role === 'FAKE').length;

                users
                  ?.filter((user) => user?.role === 'FAKE')
                  .forEach((user) => {
                    if (allUsersSelected) {
                      dispatch(setFakeUserBulkId({ ...user, selected: false }));
                    } else if (!fakeUserBulkIds?.some((fakeUser) => fakeUser.id === user.id)) {
                      dispatch(setFakeUserBulkId({ ...user, selected: true }));
                    }
                  });
              }}
              checked={
                fakeUserBulkIds?.length > 0 &&
                fakeUserBulkIds?.length === users?.filter((user) => user?.role === 'FAKE')?.length
              }
            />
            <label>
              <u><h3>Select all users</h3></u>
            </label>
          </>
        }


        <div className={styled.profileActiveMember}>
          {users?.length === 0 && (
            <CircularProgress color='secondary' style={{ marginLeft: 'none' }} />
          )}
          {users?.length !== 0 && (
            <>
              {users?.filter((user) => user?.role === 'FAKE').map((user) => (
                <button className={styled.imageButton} key={user.id} onClick={() => {
                  setSelectedUser((prevUser) => (prevUser === user ? null : user));
                  dispatch(getCustomerNoteAction(user.id));
                  dispatch(setFakeUserBulkId(user));
                }}>
                  {fakeUserBulkIds.some(fakeUser => fakeUser.id === user.id) || fakeUserId === user.id ? (
                    <>
                      <img src={tickedUser} alt="loading" />
                      <span className={styled.user_name}>
                        {user.userName}
                      </span>
                    </>
                  ) : (
                    <>
                      <img src={user?.profile?.avatarUrl ? user?.profile?.avatarUrl : tempUserImg} className={styled.avatarImg} alt='loading' />
                      {/* {unseenFakeIds.includes(user.id) &&
                        <span className={styled.countNumber}>{''}</span>
                      } */}
                      <span className={styled.user_name}>
                        {user.userName}
                      </span>
                    </>
                  )}
                </button>
              ))}
            </>
          )}
        </div>

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
            <FontAwesomeIcon icon={faCalendar} />
            <h3>
              Gender: <span>{selectedUser?.selfGender ? selectedUser?.selfGender : "N/A"}</span>
            </h3>
          </li>
          <li>
            <FontAwesomeIcon icon={faSearch} />
            <h3>
              Looking for: <span>{selectedUser?.interestedGender ? selectedUser?.interestedGender : "N/A"}</span>
            </h3>
          </li>
        </ul>
      </div>
      <div className={styled.profileActiveUserAdd}>
        <form >
          <div className={styled.formModratorGroup}>
            <textarea placeholder="Notes" value={notes} onChange={handleNotesChange}></textarea>
          </div>

          <div className={styled.formModratorGroup}>
            <button onClick={(event) => {
              event.preventDefault();
              handleNotesSubmit();
            }}>Save</button>
            <div className={styled.formModratorGroup}>
              <br />
              {selectedUser ? (
                notesByFakesId?.length > 0 ? (
                  <p>
                    <h2> <u>Note for this user</u></h2>
                    <h3>
                      <br />
                      <span className={styled.iconContainer}>
                        <FontAwesomeIcon icon={faTrash} onClick={handleDeleteNote} />
                      </span>
                      {' '}
                      <span className={styled.noteText}>
                        {notesByFakesId[0]?.note}
                      </span>
                    </h3>
                  </p>
                ) : (
                  <h3>No notes found for this user.</h3>
                )
              ) : ""}



            </div>
          </div>
        </form>
      </div >
    </div >
  );
};
export default FakeUsers;
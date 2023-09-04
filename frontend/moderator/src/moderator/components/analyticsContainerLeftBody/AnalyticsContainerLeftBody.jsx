import React, { useEffect } from 'react';
import styled from './style.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { getFakeUserNoteAction } from '../../../store/slices/moderatorApi/actions';
import { useConnection } from '../../../socket/SocketConnection';
import { useUser } from '../../../providers/useUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, CircularProgress, Modal, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import CloseIcon from '../../../assets/images/navClose.png';
import {
  faCalendar,
  faSearch,
  faUser,
  faTrash,
  faMapMarker,
  faExclamation,
  faExclamationTriangle,
} from '@fortawesome/fontawesome-free-solid';
import {
  createNotesAction,
  deleteNoteAction,
  getCustomerNoteAction,
  modCustomerListAction,
  updateNoteAction,
} from '../../../store/slices/moderatorApi/actions';
import tempUserImg from '../../../assets/images/userIcon.svg';
import { useMediaQuery } from '@material-ui/core';

const AnalyticsContainerLeftBody = () => {
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
  const { fakeChatPartners } = useSelector((state) => state.moderatorApi);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState();
  const [notes, setNotes] = useState('');
  const { loggedInUser, selectedUserFromNotifications } = useUser();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const openImageModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setModalOpen(false);
  };
  const {
    userList,
    customerNote: { data: notesByCustomerId },
    realCustomerId,
    fakeUserId,
  } = useSelector((state) => state.moderatorApi);

  const dispatch = useDispatch();
  const {
    selectedFakeConversationUser: { receiver, sender },
    setSelectedFakeConversationUser,
    fetchChats,
    acknowledgeUnseenMessageCount,
    setBlockedConversation,
  } = useConnection();

  useEffect(() => {
    if (selectedUser) {
      dispatch(getFakeUserNoteAction(selectedUser?.id));
    }
  }, [selectedUser, dispatch]);

  function calculateAge(birthDateString) {
    var birthDate = new Date(birthDateString);
    var difference = Date.now() - birthDate.getTime();
    var ageDate = new Date(difference);
    var calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    return calculatedAge ? calculatedAge : '';
  }

  const handleDeleteNote = async () => {
    const payload = {
      noteId: notesByCustomerId[0]?.id,
    };
    await dispatch(deleteNoteAction(payload));
    dispatch(getCustomerNoteAction(selectedUser?.id));
  };

  const handleUser = (user) => {
    if (sender?.id !== user.sender?.id && receiver?.id !== user.receiver?.id) {
      setBlockedConversation(user.blocked);
      fetchChats({
        senderId: user.sender?.id,
        receiverId: user.receiver?.id,
      });
      setSelectedFakeConversationUser({
        sender: user.receiver,
        receiver: user.sender,
      });
      localStorage.setItem('selectedFakeUsers', JSON.stringify(user));
      acknowledgeUnseenMessageCount(user.sender?.id, user.receiver?.id);
    }
  };
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

  function handleNotesChange(event) {
    setNotes(event.target.value);
  }

  useEffect(() => {
    return () => {
      localStorage.setItem('selectedFakeUsers', JSON.stringify({}));
    };
  }, []);

  return (
    <div className={styled.analyticsContainerleftBody}>
      <div className={styled.profileActive}>
        <div className={styled.profileActiveLeft}>
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
          {selectedUserFromNotifications?.sender?.avatar ? (
            <img
              src={selectedUserFromNotifications?.sender?.avatar}
              alt='loading'
              onClick={() => openImageModal(selectedUserFromNotifications?.sender?.avatar)}
            />
          ) : (
            <img src={tempUserImg} alt='loading' />
          )}
          <div className={styled.userActiveProfile}>
            <h3>
              {selectedUserFromNotifications?.sender?.name}{' '}
              {/* <span>{calculateAge(fakeChatPartners?.sender?.profile?.dateOfBirth)}</span> */}
              <span>
                {calculateAge(selectedUserFromNotifications?.sender?.profile?.dateOfBirth)}
              </span>
            </h3>
          </div>
          <div className={styled.clear}></div>
        </div>
        <div className={styled.profileActiveright}>
          <label>
            {selectedUserFromNotifications?.sender?.sender?.online ? 'online' : 'offline'}
          </label>
        </div>
        <div className={styled.clear}></div>
      </div>

      <div className={styled.profileActiveUserDetails}>
        <ul>
          <li>
            <FontAwesomeIcon icon={faUser} />
            <h3>
              Name:{' '}
              <span>
                {selectedUserFromNotifications?.sender?.name
                  ? selectedUserFromNotifications?.sender?.name
                  : 'N/A'}
              </span>
            </h3>
          </li>
          <li>
            <FontAwesomeIcon icon={faCalendar} />
            <h3>
              Birthday:{' '}
              <span>
                {selectedUserFromNotifications?.sender?.sender?.profile?.dateOfBirth
                  ? calculateAge(
                      selectedUserFromNotifications?.sender?.sender?.profile?.dateOfBirth,
                    )
                  : 'N/A'}
              </span>
            </h3>
          </li>
          <li>
            <FontAwesomeIcon icon={faSearch} />
            <h3>
              Looking for:{' '}
              <span>
                {selectedUserFromNotifications?.sender?.sender?.interestedGender
                  ? selectedUserFromNotifications?.sender?.sender?.interestedGender
                  : 'N/A'}
              </span>
            </h3>
          </li>
          <li>
            <FontAwesomeIcon icon={faMapMarker} />
            <h3>
              Lives in:{' '}
              <span>
                {selectedUserFromNotifications?.sender?.sender?.address?.address
                  ? selectedUserFromNotifications?.sender?.sender?.address?.address
                  : 'N/A'}
              </span>
            </h3>
          </li>

          <li>
            <FontAwesomeIcon icon={faCalendar} />
            <h3>
              Life:{' '}
              <span>
                {selectedUserFromNotifications?.sender?.sender?.profile?.life
                  ? selectedUserFromNotifications?.sender?.sender?.profile?.life
                  : 'N/A'}
              </span>
            </h3>
          </li>
          <li>
            <FontAwesomeIcon icon={faCalendar} />
            <h3>
              Registered:{' '}
              <span>
                {selectedUserFromNotifications?.sender?.sender?.createdAt
                  ? new Date(
                      selectedUserFromNotifications?.sender?.sender?.createdAt,
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
                {selectedUserFromNotifications?.sender?.sender?.profile?.profileText
                  ? selectedUserFromNotifications?.sender?.sender?.profile?.profileText
                  : 'N/A'}
              </span>
            </h3>
          </li>
        </ul>
      </div>

      <div className={styled.profileActiveUserAdd}>
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
    </div>
  );
};
export default AnalyticsContainerLeftBody;

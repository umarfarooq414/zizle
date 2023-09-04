import React, { useEffect, useRef } from 'react';
import styled from './style.module.css';
import Typography from '@mui/material/Typography';
import defaultProfileImg from '../../../assets/images/userIcon.svg';
import tickedUser from '../../../assets/images/tickedUser.png';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  fetchChat,
  getFakeUsersConversation,
  getModeratorsAction,
} from '../../../store/slices/userAuth/actions';
import { unwrapResult } from '@reduxjs/toolkit';
import ConversationList from './fakeUsersConversations/conversationList';
import FakeChatBody from './fakeChatBody/fakeChatBody';
import { adminCustomerListAction } from '../../../store/slices/adminAPI/actions';
import { useUser } from '../../../providers/useUser';

const mainHeading = {
  marginBottom: '50px',
};
const ModeratorMonitor = () => {
  const [moderators, setModerators] = useState(null);
  const ModeratorMonitor = useRef(false);
  const [user, setUser] = useState({
    sender: '',
    receiver: '',
  });
  const [moderatorSelected, setModeratorSelected] = useState(null);
  const [fakeChatPartners, setFakeChatPartners] = useState(null);
  const [fakeConversation, setFakeConversation] = useState(null);
  const [currentChatBlocked, setCurrentChatBLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { fakeUserBulkIds } = useSelector((state) => state.adminApi);
  const { token } = useUser();
  // const token = localStorage.getItem('token');
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

  useEffect(() => {
    if (ModeratorMonitor.current) return;
    ModeratorMonitor.current = true;
    dispatch(getModeratorsAction())
      .then(unwrapResult)
      .then((result) => {
        setIsLoading(false);
        setModerators(result);
      })
      .catch((error) => {});
  }, []);

  const getFakeConversation = (id) => {
    setModeratorSelected(id);
    dispatch(getFakeUsersConversation(id))
      .then(unwrapResult)
      .then((result) => {
        setFakeChatPartners(result?.fakeChatPartners);
      });
  };

  const fetchFakeChat = ({ sender, receiver, blocked }) => {
    setUser({ sender, receiver });
    setCurrentChatBLocked(blocked);
    dispatch(
      fetchChat({
        senderId: sender?.id,
        receiverId: receiver?.id,
      }),
    )
      .then(unwrapResult)
      .then((result) => {
        setFakeConversation(result.chats);
      });
  };
  return (
    <>
      <Typography variant='h6' sx={mainHeading}>
        Dashboard {'>'} Moderator Monitor
      </Typography>

      <div className={styled.containerBody}>
        <div>
          <span style={{ color: '#666', fontSize: '14px' }}>Moderators</span>
          <div className={styled.moderators}>
            {isLoading ? (
              <CircularProgress color='primary' style={{ marginLeft: '50%' }} />
            ) : (
              <>
                {moderators?.length > 0 &&
                  moderators?.map((mod) => (
                    <button
                      className={`${moderatorSelected === mod?.id && styled.profileSelected} ${
                        styled.moderatorProfile
                      }`}
                      key={mod?.id}
                      onClick={() => {
                        getFakeConversation(mod.id);
                      }}
                    >
                      <div className={styled.chatUserNewOnline}>
                        <div
                          className={
                            mod?.online
                              ? styled.chatUserNewOnlineIcon
                              : styled.chatUserNewOfflineIcon
                          }
                        ></div>
                      </div>
                      {fakeUserBulkIds?.some((fakeUser) => fakeUser?.id === mod?.id) ? (
                        <img src={tickedUser} alt='loading' />
                      ) : (
                        <img
                          src={
                            mod?.profile?.avatarUrl ? mod?.profile?.avatarUrl : defaultProfileImg
                          }
                          alt='loading'
                        />
                      )}
                      <p> {mod?.userName}</p>
                    </button>
                  ))}
              </>
            )}
          </div>
        </div>

        <div>
          <div className={styled.containerBodyLeft}>
            {fakeChatPartners && (
              <ConversationList fakeChatPartners={fakeChatPartners} fetchFakeChat={fetchFakeChat} />
            )}
          </div>
          {fakeChatPartners?.length > 0 && fakeConversation?.length > 0 && (
            <div className={styled.containerBodyCenter}>
              <FakeChatBody
                fakeConversation={fakeConversation}
                user={user}
                getFakeConversation={getFakeConversation}
                currentChatBlocked={currentChatBlocked}
              />
            </div>
          )}
          <div className={styled.clear}></div>
        </div>
        <div className={styled.clear}></div>
      </div>
    </>
  );
};

export default ModeratorMonitor;

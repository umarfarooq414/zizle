import React, { useState, useMemo, useEffect } from 'react';
import styled from './style.module.css';
import UserP from '../../../../assets/images/userP.jpg';
import CircularProgress from '@mui/material/CircularProgress';
import { Stack, Switch } from '@mui/material';

const ConversationList = ({ fakeChatPartners, fetchFakeChat }) => {
  const [selectedConversation, setSelectedConversation] = useState();
  const [blockedConversation, setBlockedConversation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const chatsPartners = useMemo(() => {
    if (blockedConversation) {
      return fakeChatPartners.filter((chat) => chat.blocked && chat);
    } else {
      return fakeChatPartners;
    }
  }, [blockedConversation, fakeChatPartners]);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className={styled.ConversationList}>
      <Stack direction='row' spacing={1}>
        <Switch
          checked={blockedConversation}
          onChange={() => {
            setBlockedConversation(!blockedConversation);
          }}
        />
        <label
          htmlFor='female'
          style={{ display: 'inline-block', width: 'auto', fontSize: '14px', marginTop: '10px' }}
        >
          Blocked Chats
        </label>
      </Stack>
      {chatsPartners?.length > 0 ? (
        <div className={styled.userAnnoucementChatLeft}>
          {isLoading ? (
            <CircularProgress color='primary' style={{ marginLeft: '50%' }} />
          ) : (
            <ul>
              {chatsPartners?.map((user) => (
                <li
                  key={user?.id}
                  onClick={() => {
                    fetchFakeChat(user);
                    setSelectedConversation(user);
                  }}
                  className={`${
                    selectedConversation?.receiver.id === user.receiver.id &&
                    selectedConversation?.sender.id === user.sender.id &&
                    styled.activeConversation
                  } ${user.blocked && styled.blockedConversation}`}
                >
                  {/* {user?.unseenCount > 0 && (
                  <span className={styled.countNumber}>{user?.unseenCount}</span>
                )} */}
                  <div className={styled.farvHeadDate}>
                    <div className={styled.farvHeadDate1}>
                      <div className={styled.farv_contl}>
                        <div className={styled.farv_img}>
                          <img src={user.receiver.avatar ? user.receiver.avatar : UserP} alt='' />
                        </div>
                        <h3 style={{ marginLeft: '12px' }}>{user.receiver.name}</h3>
                      </div>
                      -
                      <div className={styled.farv_contl}>
                        <h3 style={{ marginRight: '12px' }}>{user.sender.name}</h3>
                        <div className={styled.farv_img}>
                          <img src={user.sender?.avatar ? user.sender?.avatar : UserP} alt='' />
                        </div>
                      </div>
                    </div>
                    <span className={styled.farv_contr}>Dec 9</span>
                    <div className={styled.farvContent}></div>
                  </div>
                  <div className={styled.clear}></div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className={styled.userAnnoucementNoMessage}>No Message to Display</div>
      )}
    </div>
  );
};
export default ConversationList;

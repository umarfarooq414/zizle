import React, { useEffect } from 'react';
import styled from './style.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { getFakeUserNoteAction } from '../../../store/slices/moderatorApi/actions';
import { useConnection } from '../../../socket/SocketConnection';
import UserP from '../../../assets/images/userP.jpg';

const ViewContainerLeftBody = () => {
  const { fakeChatPartners } = useSelector((state) => state.moderatorApi);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState();

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

  useEffect(() => {
    return () => {
      localStorage.setItem('selectedFakeUsers', JSON.stringify({}));
    };
  }, []);

  return (
    <div className={styled.analyticsContainerleftBody}>
      {fakeChatPartners?.length > 0 ? (
        <div className={styled.userAnnoucementChatLeft}>
          <ul>
            {fakeChatPartners?.map((user) => (
              <li
                key={user?.id}
                onClick={() => {
                  handleUser(user);
                  setSelectedConversation(user);
                }}
                className={`${selectedConversation?.receiver.id === user.receiver.id &&
                  selectedConversation?.sender.id === user.sender.id &&
                  styled.activeConversation
                  } ${user.blocked && styled.blockedConversation}`}
              >
                {user?.unseenCount > 0 &&
                  sender?.id !== user.sender?.id &&
                  receiver?.id !== user.receiver?.id && (
                    <span className={styled.countNumber}>{user?.unseenCount}</span>
                  )}
                <div>
                  <div className={styled.farvHeadDate}>
                    <div className={styled.farvHeadDate1}>
                      <div className={styled.farv_contl}>
                        <div className={styled.farv_img}>
                          <img src={user.sender.avatar ? user.sender.avatar : UserP} alt='' />
                        </div>
                        <h3 style={{ marginLeft: '12px' }}>{user.sender.name}</h3>
                      </div>
                      -
                      <div className={styled.farv_contl}>
                        <h3 style={{ marginRight: '12px' }}>{user.receiver.name}</h3>
                        <div className={styled.farv_img}>
                          <img src={user.receiver?.avatar ? user.receiver?.avatar : UserP} alt='' />
                        </div>
                      </div>
                    </div>
                    <span className={styled.farv_contr}>Dec 9</span>
                    <div className={styled.farvContent}>{/* <p>{messages?.message}</p> */}</div>
                  </div>
                  <div className={styled.clear}></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={styled.userAnnoucementNoMessage}>no message to display</div>
      )}
    </div>
  );
};
export default ViewContainerLeftBody;

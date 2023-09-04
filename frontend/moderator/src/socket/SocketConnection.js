/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable-next-line no-unused-vars*/
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { fetchChat, getFakeUsersConversation } from '../store/slices/moderatorApi/actions';
import { useUser } from '../providers/useUser';
const SOCKET_URL = process.env.SOCKET_IO_URL || 'https://backend.zizle.de';

const ConnectionContext = createContext();

export const ConnectionProvider = (props) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [moderatorIds, setModeratorIds] = useState([]);
  const [users, setUsers] = useState();
  const [currentSelectedUser, setCurrentSelectedUser] = useState(null);
  const [pingIntervalId, setPingIntervalId] = useState(null);
  const [userCount, setUserCount] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [blockedConversation, setBlockedConversation] = useState(false);
  const [selectedFakeConversationUser, setSelectedFakeConversationUser] = useState({
    currentUser: '',
    currentSelectedUser: '',
  });
  const { selectedUserFromNotifications } = useUser();
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const userCounts = {};
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const accessToken = localStorage.getItem('token');

  const connectSocket = (accessToken) => {
    const newSocket = io(SOCKET_URL, { transports: ['websocket'], query: { token: accessToken } });
    setSocket(newSocket);
    return newSocket;
  };

  useEffect(() => {
    if (accessToken) {
      const newSocket = connectSocket(accessToken);
      return () => {
        newSocket.disconnect();
      };
    }
  }, [accessToken]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', handleConnect);
      socket.on('pong', handlePong);
      socket.on('disconnect', handleDisconnect);
      socket.on('availableUsersFromServer', (data) => {
        setOnlineUsers(data);
      });
      socket?.on('sendMessage', (data) => {
        setMessages((msgs) => [...msgs, data]);
      });

      socket.on('receiveMessage', (data) => {
        dispatch(
          getFakeUsersConversation({
            token: accessToken,
          }),
        );
        // getUserChat()
        if (
          data.sender === selectedUserFromNotifications?.receiver?.id &&
          data.receiver === selectedUserFromNotifications?.sender?.id
        ) {
          setMessages((msgs) => [...msgs, data]);
        }
        const { receiver, sender } = selectedUserFromNotifications;
        if (sender?.id === data.receiver && receiver?.id === data.sender) {
          acknowledgeUnseenMessageCount(data.receiver, data.sender);
        }
      });

      socket.on('getUnseenMessageCountNotification', (data) => {
        setUserCount(data);
      });
      socket.on('acknowledgementFromServer', (data) => {
        dispatch(
          getFakeUsersConversation({
            token: accessToken,
          }),
        );
        setUserCount(data);
      });

      return () => {
        socket.off('connect', handleConnect);
        socket.off('pong', handlePong);
        socket.off('disconnect', handleDisconnect);
        socket.off('sendMessage');
        socket.off('receiveMessage');
        socket.off('acknowledgementFromServer');
        socket.off('getUnseenMessageCountNotification');
      };
    }
  }, [socket, selectedUserFromNotifications]);

  const handleConnect = () => {
    const newPingIntervalId = setInterval(() => {
      socket.emit('ping');
    }, 5000);
    setPingIntervalId(newPingIntervalId);
    socket.emit('fake', currentUser?.id);
  };

  const handlePong = () => {};

  const handleDisconnect = () => {
    clearInterval(pingIntervalId);
  };

  const fetchChats = (id) => {
    dispatch(fetchChat(id))
      .then(unwrapResult)
      .then((result) => {
        setMessages(result.chats);
        setModeratorIds(result.moderatorIds);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    socket?.emit('logoutNotification', currentUser?.id);
    socket?.emit('unseenMessageCount', {
      userId: currentSelectedUser?.id,
      moderatorId: currentUser?.id,
    });

    return () => {
      socket?.off('acknowledge');
      setMessages([]);
    };
  }, [currentSelectedUser]);

  const sendMessage = (message) => {
    if (socket) {
      socket.emit('sendMessage', message);
    }
  };

  const acknowledgeUnseenMessageCount = (fakerId, realCustomerId) => {
    if (socket) {
      socket?.emit(
        'acknowledge',
        { currentUser: fakerId },
        { currentSelectedUser: realCustomerId },
        { currentModerator: currentUser?.id },
      );
    }
  };

  // const getUserChat = () => {
  //   //fetch user chat
  //   dispatch(fetchChatusers())
  //     .then(unwrapResult)
  //     .then((result) => {

  //       setUsers(result);
  //     })
  //     .catch((error) => {
  //     });
  // };

  const value = {
    socket,
    setSocket,
    sendMessage,
    messages,
    setMessages,
    // getUserChat,
    fetchChats,
    users,
    setUsers,
    setCurrentSelectedUser,
    currentSelectedUser,
    userCounts,
    userCount,
    setUserCount,
    onlineUsers,
    setOnlineUsers,
    acknowledgeUnseenMessageCount,
    selectedFakeConversationUser,
    setSelectedFakeConversationUser,
    setBlockedConversation,
    blockedConversation,
  };

  return (
    <>
      <ConnectionContext.Provider value={value} {...props} />
    </>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
};

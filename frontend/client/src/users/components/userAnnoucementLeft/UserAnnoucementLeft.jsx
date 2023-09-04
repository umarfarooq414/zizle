/* eslint-disable react-hooks/rules-of-hooks */
import React, { Fragment, useState, useEffect, useRef, useContext } from 'react';
import styled from './style.module.css';
import { useConnection } from '../../../socket/SocketConnection';
import { Link } from 'react-router-dom';
import UserAnnouncement from '../userAnnoucement/userAnnoucement';
import { useUser } from '../../../providers/useUser';
import { FormControl, TextField } from '@mui/material';
import { useDebouncedCallback } from 'use-debounce';
import MaleAvatr from '../../../assets/images/male.png';
import FemaleAvatr from '../../../assets/images/female.png';
import UserFavourtiesIcon from '../../../assets/images/favourties_icon.svg';
import DarkModeContext from '../../../providers/DarkModeContext';
const UserAnnoucementLeft = (props) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [search, setSearch] = useState(``);
  const [conversations, setConversations] = useState([]);

  const {
    users,
    getUserChat,
    socket,
    userCount,
    setCurrentSelectedUser,
    currentSelectedUser,
    fetchChats,
    userChatTime,
  } = useConnection();
  const { user, blockedUser } = useUser();
  const currentUser = user;
  const userChatFetchecRef = useRef(false);

  useEffect(() => {
    const url = window.location.href;
    const regex = /\/userAnnoucements\/\?(.*)/;
    const match = url.match(regex);
    const id = match ? match[1] : '';

    if (id && users?.length > 0) {
      const activeCurrentUser = users?.find((user) => user?.id === id && user);
      setCurrentSelectedUser(activeCurrentUser);
      fetchChats(activeCurrentUser?.id);
    }
  }, [userCount, users]);

  useEffect(() => {
    setConversations(users);
  }, [users]);

  useEffect(() => {
    if (userChatFetchecRef.current) return;
    userChatFetchecRef.current = true;
    getUserChat();
    return () => {
      setCurrentSelectedUser(null);
    };
  }, []);

  const handleUser = (user) => {
    setCurrentSelectedUser(user);
    fetchChats(user?.id);
    socket?.emit(
      'acknowledge',
      { currentUser: currentUser?.id },
      { currentSelectedUser: user?.id },
    );
  };

  const findConversation = useDebouncedCallback((value) => {
    if (value.length) {
      setConversations(
        conversations.filter((user) => {
          if (user?.userName.toLowerCase().includes(value.toLowerCase())) {
            return user;
          }
        }),
      );
    } else {
      setConversations(users);
    }
  }, 200);

  const filteredData = conversations?.filter((convo) => {
    const blocked = blockedUser?.find((blockedUser) => blockedUser?.blocked?.id === convo?.id);
    return blocked === undefined;
  });

  const userToLatestChatTime = userChatTime?.reduce((acc, current) => {
    acc[current.user.id] = new Date(current?.latestChatTime);
    return acc;
  }, {});

  const sortedUsers = filteredData?.sort((userA, userB) => {
    const userALatestChatTime = userToLatestChatTime[userA.id] || new Date(0); // default to earliest possible date if no chat time exists
    const userBLatestChatTime = userToLatestChatTime[userB.id] || new Date(0); // default to earliest possible date if no chat time exists

    return userBLatestChatTime - userALatestChatTime;
  });

  return (
    <Fragment>
      <div className={styled.userAnnoucementChat}>
        {users?.length > 0 ? (
          <div
            className={styled.userAnnoucementChatLeft}
            style={{ display: window.innerWidth <= 600 && currentSelectedUser ? 'none' : 'block' }}
          >
            <FormControl fullWidth>
              <TextField
                id='outlined-basic'
                variant='outlined'
                placeholder='Search'
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  findConversation(e.target.value);
                }} // update this line
                sx={{
                  position: 'relative',
                  borderRadius: '10',
                }}
                type='search'
                InputProps={{
                  sx: {
                    color: isDarkMode ? '#fff' : '#000',
                    borderRadius: 10,
                    // height: "2.25rem"
                  },
                }}
                className={styled.searchField}
              />
            </FormControl>
            <ul className={isDarkMode ? 'dark-mode' : ''}>
              {sortedUsers?.map((user) => (
                <Link to={`/userAnnoucements/?${user?.id}`}>
                  <li
                    key={user?.id}
                    onClick={() => handleUser(user)}
                    className={`${
                      userCount?.length > 0 &&
                      userCount
                        .map((thisUser) => {
                          if (
                            thisUser?.userId === user?.id &&
                            user?.id !== currentSelectedUser?.id
                          ) {
                            return styled.notification;
                          } else {
                            return styled.withoutNotification;
                          }
                        })
                        .join(' ')
                    }${isDarkMode ? ' dark-mode' : ''}`}
                    style={{
                      backgroundColor:
                        currentSelectedUser?.id === user?.id
                          ? '#2563eb'
                          : isDarkMode
                          ? '#1a1a1a'
                          : '#fff',
                    }}
                  >
                    {userCount?.length > 0 &&
                      userCount.map((thisUser) => {
                        if (thisUser.userId === user.id && user.id !== currentSelectedUser?.id)
                          return <span className={styled.countNumber}>{thisUser.count}</span>;
                      })}

                    <div className={styled.farv_img}>
                      {!user?.profile?.avatarUrl ? (
                        user?.selfGender === 'Male' ? (
                          <img src={MaleAvatr} alt='' />
                        ) : (
                          <img src={FemaleAvatr} alt='' />
                        )
                      ) : (
                        <img src={`${user?.profile?.avatarUrl}`} alt='' />
                      )}
                      <div className={styled.chatUserNewOnline}>
                        <div
                          className={
                            user?.online
                              ? styled.chatUserNewOnlineIcon
                              : styled.chatUserNewOfflineIcon
                          }
                        ></div>
                      </div>
                    </div>
                    <div className={styled.farvHeadDate}>
                      <div className={styled.farvHeadDate1}>
                        <div className={styled.farv_contl}>
                          <h3
                            style={{
                              color:
                                currentSelectedUser?.id === user?.id
                                  ? '#fff'
                                  : isDarkMode
                                  ? '#fff'
                                  : '#000',
                            }}
                          >
                            {user?.userName} <br />
                            <span style={{ fontSize: '10px', fontWeight: '300' }}>
                              {user.lastMessage}
                            </span>
                          </h3>
                        </div>
                        <div
                          className={styled.farv_contr}
                          style={{
                            color:
                              currentSelectedUser?.id === user?.id
                                ? '#fff'
                                : isDarkMode
                                ? '#fff'
                                : '#000',
                          }}
                        >
                          {user?.createdAt.split('T')[0]}
                        </div>
                        <div className={styled.clear}></div>
                      </div>
                      <div className={styled.farvContent}>{/* <p>{messages?.message}</p> */}</div>
                    </div>
                    <div className={styled.clear}></div>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        ) : (
          <div className={styled.userAnnoucementNoMessage}>no message to display</div>
        )}
        {currentSelectedUser ? (
          <UserAnnouncement user={currentSelectedUser} />
        ) : (
          <div className={styled.ghostImg}>
            <img src={UserFavourtiesIcon} alt='a' />
            <p>Creepy, there&apos;s nothing here.</p>
          </div>
        )}
        <div className={styled.clear}></div>
      </div>
    </Fragment>
  );
};

export default UserAnnoucementLeft;

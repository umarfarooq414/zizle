import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from './style.module.css';
import ProfileImage from '../../../assets/images/profile_image.jpg';
import { useUser } from '../../../providers/useUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComment,
  faCommentDots,
  faCommentSlash,
  faComments,
  faSearch,
} from '@fortawesome/fontawesome-free-solid';
import { useConnection } from '../../../socket/SocketConnection';
import { style } from '@mui/system';
import { useSelector } from 'react-redux';
import tempUserImg from '../../../assets/images/userIcon.svg';
import { setRealCustomerId } from '../../../store/slices/moderatorApi/moderatorApiSlice';
export const HeaderRight = ({ sendDataToParent }) => {
  const { fakeChatPartners } = useSelector((state) => state.moderatorApi);
  // const [selectedUser, setSelectedUser] = useState()

  const {
    setToken,
    setLoggedInUser,
    setSelectedUserFromNotifications,
    selectedUserFromNotifications,
    loggedInUser,
  } = useUser();
  const navigate = useNavigate();
  const [isDropdownShown, setIsDropdownShown] = useState(false);
  const [isDropdownShown1, setIsDropdownShown1] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownShown(!isDropdownShown);
  };

  const dropdownRef = useRef(null);

  const toggleDropdown1 = () => {
    setIsDropdownShown1(!isDropdownShown1);
  };

  const handleOutsideClick = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !event.target.classList.contains(styled.notificationContainers) // Exclude notification container from closing
    ) {
      setIsDropdownShown(false);
      setIsDropdownShown1(false);
    }
  };

  // Add click event listener when the component mounts
  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const [selectedHeading, setSelectedHeading] = useState(null);

  const handleHeadingClick = (heading) => {
    setSelectedHeading(heading);
  };

  useEffect(() => {
    const storedSelectedUser = localStorage.getItem('selectedUserFromNotifications');
    setSelectedUserFromNotifications(storedSelectedUser ? JSON.parse(storedSelectedUser) : null);
  }, []);

  useEffect(() => {
    if (selectedUserFromNotifications) {
      localStorage.setItem(
        'selectedUserFromNotifications',
        JSON.stringify(selectedUserFromNotifications),
      );
    }
  }, [selectedUserFromNotifications]);
  useEffect(() => {
    const storedSelectedUser = JSON.parse(localStorage.getItem('selectedUserFromNotifications'));
    const obj = {
      sender: storedSelectedUser?.sender,
      receiver: storedSelectedUser?.receiver,
    };
    setSelectedHeading(obj);
  }, []);

  const logout = () => {
    setLoggedInUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    if (window.history && window.history.pushState) {
      window.history.pushState('', null, './');
      window.onpopstate = function () {
        window.history.pushState('', null, './');
      };
    }
  };

  const handleClick = (realUser) => {
    sendDataToParent(realUser);
  };
  // const props = {
  //   userIdFromNotifications: selectedUser
  // }

  const {
    sendMessage,
    messages,
    setMessages,
    selectedFakeConversationUser: { receiver, sender },
    blockedConversation,
    userChatTime,
  } = useConnection();

  // const filteredData = fakeChatPartners.filter((user) => {
  //   const realUser = messages.find((msg) => msg?.sender === user?.receiver?.id);
  //   return realUser;
  // });

  const sortedChatPartners = [...fakeChatPartners].sort((a, b) => {
    const dateA = new Date(a.latestChatTime);
    const dateB = new Date(b.latestChatTime);

    return dateB - dateA;
  });

  return (
    <>
      <div className={styled.HeaderRight1} ref={dropdownRef}>
        <ul className={styled.headerTogglePanel}>
          <li>
            <Link to='/home'>Moderator Panel</Link>
          </li>
          <li>
            <Link to='/moderator'>Analytics Panel</Link>
          </li>
          <li>
            <Link to='/visit-fake-users'>Send Visits</Link>
          </li>
        </ul>
        <div className={styled.showMessagesHeader}>
          <ul>
            <li onClick={toggleDropdown1}>
              <FontAwesomeIcon icon={faCommentDots} />
              {sortedChatPartners.map((unseenUserMessages) =>
                // console.log('unseen', selectedUserFromNotifications);
                // unseenUserMessages?.receiver?.id !== selectedUserFromNotifications?.receiver?.id &&
                unseenUserMessages?.unseenCount ? (
                  <span id={styled.blinkSpan} className={styled.countNumber}>
                    {`New unseen messages`}
                  </span>
                ) : null,
              )}
            </li>
            {/* ************************************* */}
            {isDropdownShown1 && (
              <div className={styled.notificationContainer}>
                <div class='notification-icon right'>
                  <h4 class='material-icons dp48'>NOTIFICATIONS</h4>
                </div>
                {sortedChatPartners?.map((realUser) => (
                  <div
                    className={styled.notificationContainers}
                    onClick={() => {
                      setSelectedUserFromNotifications(realUser);
                      setIsDropdownShown1(false);
                    }}
                  >

                    <div
                      className={`${styled.notificationContainer1} ${
                        selectedHeading?.receiver?.id === realUser?.receiver?.id &&
                        selectedHeading?.sender?.id === realUser?.sender?.id
                          ? styled.selectedContainer
                          : ''
                      } ${
                        selectedHeading?.receiver?.id !== realUser?.receiver?.id &&
                        realUser?.unseenCount > 0
                          ? styled.unSeenMsg
                          : ''
                      }`}
                    >
                      <Link to={`/home/?${realUser?.receiver?.id}`}>
                        <div className={styled.notificationContainer1}>
                          {realUser?.receiver?.avatar ? (
                            <img src={realUser?.receiver?.avatar} alt='loading' />
                          ) : (
                            <img src={tempUserImg} alt='loading' />
                          )}
                        </div>
                        <div className={styled.notificationContainer1}>
                          {realUser?.unseenCount > 0 ? (
                            <span className={styled.unseenMessagesCount}>
                              {realUser?.unseenCount}
                            </span>
                          ) : (
                            ''
                          )}
                          <h3
                            className={`${
                              selectedHeading?.receiver?.id === realUser?.receiver?.id &&
                              selectedHeading?.sender?.id === realUser?.sender?.id
                                ? styled.selectedHeading
                                : ''
                            } ${
                              selectedHeading?.receiver?.id !== realUser?.receiver?.id &&
                              realUser?.unseenCount > 0
                                ? styled.unSelectedHeading
                                : ''
                            }`}
                            onClick={() => {
                              handleHeadingClick(realUser);
                            }}
                          >
                            {' '}
                            New message from {realUser?.receiver?.name} to {realUser?.sender?.name}
                          </h3>
                        </div>
                        <div className={styled.clear}></div>
                      </Link>
                    </div>
                    <div className={styled.clear}></div>
                  </div>
                ))}
              </div>
            )}
            {/* ************************************* */}
          </ul>
        </div>
        <div className={styled.headerSelection}>
          <div className={styled.headerSelectImg} onClick={toggleDropdown}>
            <img src={ProfileImage} alt='' />
            <span>{loggedInUser?.userName}</span>
          </div>
          {isDropdownShown && (
            <div className={styled.headerSelectdropdown}>
              <ul>
                <li>
                  <Link to='/home'>Home</Link>
                </li>
                <li>
                  <Link to='/moderator'>Moderator</Link>
                </li>
                <li>
                  <Link to='/visit-fake-users'>Send Visits</Link>
                </li>
                <li>
                  <button onClickCapture={logout}>Logout</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

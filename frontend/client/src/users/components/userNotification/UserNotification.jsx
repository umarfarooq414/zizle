import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from './style.module.css';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ProfileNotificationIcon from '../../../assets/images/profileVisitorNotify.svg';
import HeartNotificationIcon from '../../../assets/images/heartNotify.svg';
import { useDispatch } from 'react-redux';
import {
  getNotifications,
  readAllNotifications,
  seenNotification,
} from '../../../store/slices/userAuth/actions';
import { unwrapResult } from '@reduxjs/toolkit';
import DarkModeContext from '../../../providers/DarkModeContext';
const UserNotification = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isMobileVersionVisible, setIsMobileVersionVisible] = useState(false);
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [notificationsRes, setNotificationsRes] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const notificationsFetched = useRef(false);
  const userNotificationRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const deviceWidth = window.innerWidth;
      setIsMobileVersionVisible(deviceWidth <= 786);
    };

    handleResize(); // Initial check on component mount

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getAllNotifications = (page) => {
    if (localStorage.getItem('token'))
      dispatch(getNotifications(page))
        .then(unwrapResult)
        .then((result) => {
          setNotificationsRes(result);
          setNotifications([...notifications, ...result?.notifications]);
        });
  };

  useEffect(() => {
    if (notificationsFetched.current) return;
    notificationsFetched.current = true;
    getAllNotifications(1);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userNotificationRef.current && !userNotificationRef.current.contains(event.target)) {
        setNotificationVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationClick = () => {
    setNotificationVisible((prevValue) => !prevValue);
  };

  const handleSpanClick = () => {
    setNotificationVisible(false);
  };

  // const handleSeenNotification = (id) => {
  //   dispatch(seenNotification(id))
  //   setSeen(true)
  //   // .then(unwrapResult)
  //   // .then((result) => {
  //   //   if (result) {
  //   //     getAllNotifications(1);
  //   //   }
  //   // });
  //   handleReadAllNotifications()
  // };
  const handleSeenNotification = (id) => {
    dispatch(seenNotification(id));
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id),
    );
    // handleReadAllNotifications();
  };

  const handleReadAllNotifications = () => {
    dispatch(readAllNotifications())
      .then(unwrapResult)
      .then((result) => {
        if (result) {
          setNotifications([]);
          // getAllNotifications(1);
        }
      });
  };

  const previewNotification = (notification) => {
    if (notification.category === 'LIKED') {
      navigate(`/profile/${notification?.notifier?.id}`);
    } else if (notification?.category === 'VISITED') {
      navigate(`/userProfileVisitor`);
    }
    setNotificationVisible(false);
    setIsMobileVersionVisible(false);
  };

  const observer = useRef();
  const lastNotificationRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((enteries) => {
        if (enteries[0].isIntersecting && notificationsRes?.nextPage) {
          getAllNotifications(notificationsRes?.nextPage);
        }
      });

      if (node) observer.current.observe(node);
    },
    [notificationsRes?.nextPage],
  );

  return (
    <div
      className={`${styled.userNotification} ${isMobileVersionVisible ? styled.mobileVersions : styled.desktopVersions
        }`}
    >
      <button
        className={styled.iconNotificationButton}
        onClick={handleNotificationClick}
        style={{ cursor: 'pointer' }}
      >
        <NotificationsIcon style={{ fill: isDarkMode ? '#fff' : '#000' }} />
        {notifications.length > 0 ? (
          <span className={styled.countNumber}> {notifications.length}</span>
        ) : null}
      </button>
      {isNotificationVisible && (
        <div
          className={`${styled.notificationBody} ${isDarkMode ? styled.notificationBodyDark : ''}`}
        >
          <div style={{ position: 'relative' }}>
            <div className={styled.notificationTitle}>
              <h2>NOTIFICATIONS</h2>
              <span
                style={{ border: isDarkMode ? '1px solid #fff' : '1px solid #000' }}
                onClick={handleSpanClick}
                className={styled.hideNotifications}
              >
                x
              </span>
            </div>
            <div className={styled.notifyBody}>
              {/* <ul>
                <div className={styled.readAll}>
                  {notifications?.length > 0 && (
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleReadAllNotifications()}
                    >
                      Read All
                    </span>
                  )}
                </div>
                {notifications && notifications.length > 0 ? (
                  notifications.map((notification, index) =>
                    notifications.length === index + 1 ? (
                      <li
                        className={`${styled.notification} ${!notification.seen && styled.notificationUnread
                          }`}
                        key={'notification ' + index}
                        ref={lastNotificationRef}
                      >
                        <div onClick={() => previewNotification(notification)}>
                          <img
                            src={
                              notification.category === 'LIKED'
                                ? HeartNotificationIcon
                                : ProfileNotificationIcon
                            }
                            alt=''
                          />
                          <h4>{notification?.message}</h4>
                        </div>
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSeenNotification(notification?.id)}
                        >
                          x
                        </span>
                      </li>
                    ) : (
                      <li
                        className={`${styled.notification} ${!notification.seen && styled.notificationUnread
                          }`}
                        key={'notification ' + index}
                      >
                        <div onClick={() => previewNotification(notification)}>
                          <img
                            src={
                              notification.category === 'LIKED'
                                ? HeartNotificationIcon
                                : ProfileNotificationIcon
                            }
                            alt=''
                          />
                          <h4>{notification.message}</h4>
                        </div>
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSeenNotification(notification?.id)}
                        >
                          x
                        </span>
                      </li>
                    ),
                  )
                ) : (
                  <p>No new notifications!</p>
                )}
              </ul> */}
              <ul>
                <div className={styled.readAll}>
                  {notifications?.length > 0 && (
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleReadAllNotifications()}
                    >
                      Read All
                    </span>
                  )}
                </div>
                {notifications && notifications.length > 0 ? (
                  notifications.map((notification, index) =>
                    notifications.length === index + 1 ? (
                      <li
                        className={`${styled.notification} ${!notification.seen && styled.notificationUnread
                          }`}
                        key={'notification ' + index}
                        ref={lastNotificationRef}
                      >
                        <div onClick={() => {
                          handleSeenNotification(notification?.id);
                          previewNotification(notification);
                        }}>
                          <img
                            src={
                              notification.category === 'LIKED'
                                ? HeartNotificationIcon
                                : ProfileNotificationIcon
                            }
                            alt=''
                          />
                          <h4>{notification?.message}</h4>
                        </div>
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSeenNotification(notification?.id)}
                        >
                          x
                        </span>
                      </li>
                    ) : (
                      <li
                        className={`${styled.notification} ${!notification.seen && styled.notificationUnread
                          }`}
                        key={'notification ' + index}
                      >
                        <div onClick={() => {
                          handleSeenNotification(notification?.id);
                          previewNotification(notification);
                        }}>
                          <img
                            src={
                              notification.category === 'LIKED'
                                ? HeartNotificationIcon
                                : ProfileNotificationIcon
                            }
                            alt=''
                          />
                          <h4>{notification.message}</h4>
                        </div>
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSeenNotification(notification?.id)}
                        >
                          x
                        </span>
                      </li>
                    ),
                  )
                ) : (
                  <p>No new notifications!</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNotification;

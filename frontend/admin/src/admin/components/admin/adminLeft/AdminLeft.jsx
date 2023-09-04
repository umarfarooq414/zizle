import React, { useState } from 'react';
import styled from './style.module.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link, useNavigate } from 'react-router-dom';
import ProfilePic from '../../../../assets/images/profile_pic.png';
import More from '../../../../assets/images/more.png';

import MenuIcon from '../../../../assets/images/navMenu.png';
import MenuClose from '../../../../assets/images/navClose.png';
import { useUser } from '../../../../providers/useUser';
import { useEffect } from 'react';

const sidebarTabs = [
  {
    title: 'Dashboard',
    route: '/admin/dashboard',
  },
  // {
  //   title: 'Analytics',
  //   route: '/admin/statistics',
  // },
  // {
  //   title: 'Online Users',
  //   route: '/admin/online/users',
  // },
  {
    title: 'User',
    route: '/admin/user',
  },
  {
    title: 'Queries',
    route: '/admin/queries',
  },
  {
    title: 'Coin Management',
    route: '/admin/coin-management',
    // subRoutes: [
    //   {
    //     subTitle: 'Coin Management',
    //     subRoute: '/admin/coin-management',
    //   },
    // {
    //   subTitle: 'Create Coin Management',
    //   subRoute: '/admin/create-coin-management',
    // },
    // ],
  },
  {
    title: 'All Mod Gallery',
    route: '/admin/all-mod-gallery',
  },
  {
    title: 'Fake User',
    subRoutes: [
      {
        subTitle: 'All Fake User',
        subRoute: '/admin/fake-user',
      },
      {
        subTitle: 'Create Fake user',
        subRoute: '/admin/create-fakeuser',
      },
    ],
  },

  {
    title: 'Gift',
    subRoutes: [
      {
        subTitle: 'All Gifts',
        subRoute: '/admin/gift-screen',
      },
      {
        subTitle: 'Create Gift',
        subRoute: '/admin/create-gift-screen',
      },
    ],
  },
  {
    title: 'Subscription',
    subRoutes: [
      {
        subTitle: 'All Subscription',
        subRoute: '/admin/subscription-list',
      },
      {
        subTitle: 'Create Subscription',
        subRoute: '/admin/create-subscription',
      },
    ],
  },

  {
    title: 'Bonus Codes',
    subRoutes: [
      {
        subTitle: 'All Bonus Code',
        subRoute: '/admin/bonus-codes',
      },
      {
        subTitle: 'Create Bonus Code',
        subRoute: '/admin/create-bonus-code',
      },
      {
        subTitle: 'Send Support Message',
        subRoute: '/admin/bulk-messages',
      },
    ],
  },
  {
    title: 'Moderator',
    subRoutes: [
      {
        subTitle: 'All Moderator',
        subRoute: '/admin/moderator',
      },
      {
        subTitle: 'Create Moderator',
        subRoute: '/admin/create-moderator',
      },
      {
        subTitle: 'Moderator Monitor',
        subRoute: '/admin/moderator-monitor',
      },
    ],
  },
  {
    title: 'News',
    subRoutes: [
      {
        subTitle: 'Static Message',
        subRoute: '/admin/static-message',
      },
      {
        subTitle: 'Multi Message',
        subRoute: '/admin/multi-message',
      },
    ],
  },
];

const AdminLeft = () => {
  const [currentOpenIndex, setCurrentOpenIndex] = useState(null);
  const [isDropdownShown, setIsDropdownShown] = useState(false);
  const [isMobileVersionVisible, setIsMobileVersionVisible] = useState(false);
  const { setToken, setLoggedInUser } = useUser();

  const navigate = useNavigate();
  const { loggedInUser } = useUser();
  const user = loggedInUser;

  const toggleDropdown = () => {
    setIsDropdownShown(!isDropdownShown);
  };

  const logout = () => {
    setToken(null);
    setLoggedInUser(null);
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
  useEffect(() => {}, [logout]);

  const toggleMobileVersion = () => {
    // if (tab.subRoutes) {
    //   return;
    // }

    setIsMobileVersionVisible(!isMobileVersionVisible);
  };

  const handleTabClick = (tab, index) => {
    if (tab.subRoutes && tab.subRoutes?.length) {
      if (currentOpenIndex === index) {
        setCurrentOpenIndex(null);
      } else {
        setCurrentOpenIndex(index);
      }
    } else {
      navigate(tab.route && tab.route);
      setCurrentOpenIndex(null);
      toggleMobileVersion();
    }
  };

  return (
    <div>
      <div className={styled.mobileVersion} onClick={toggleMobileVersion}>
        {isMobileVersionVisible ? <img src={MenuClose} alt='' /> : <img src={MenuIcon} alt='' />}
      </div>
      <div
        className={isMobileVersionVisible ? `${styled.desktopVersion}` : `${styled.mobileHidden}`}
      >
        <List>
          <div>
            <div className={styled.userprofile}>
              <div className={styled.userinner}>
                <img src={ProfilePic} alt='' />
                <p>
                  {user?.userName} <br></br>
                  {/* {user?.role} */}
                </p>
                <img src={More} alt='more' className={styled.moreImage} onClick={toggleDropdown} />
              </div>
              {isDropdownShown && (
                <div className={styled.dropdownNav}>
                  <ul>
                    <li>
                      <button onClickCapture={logout}>Logout</button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {sidebarTabs.map((tab, index) => (
            <>
              <div
                button
                component={Link}
                sx={{ pl: 0, pt: 0, pb: 0 }}
                className={styled.listItem}
                onClick={() => handleTabClick(tab, index)}
              >
                <ListItemText className={styled.tabTitle} primary={tab.title} />
                <div className={styled.tabIcon}>
                  {tab.subRoutes ? (
                    tab.subRoutes?.length > 0 && currentOpenIndex === index ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )
                  ) : (
                    ''
                  )}
                </div>
              </div>
              {tab.subRoutes && (
                <Collapse in={currentOpenIndex === index} timeout='auto' unmountOnExit>
                  {tab.subRoutes?.map((subRoute) => (
                    <ListItemText
                      className={styled.subTabItems}
                      primary={subRoute.subTitle}
                      onClick={() => {
                        navigate(subRoute.subRoute);
                        toggleMobileVersion();
                      }}
                    />
                  ))}
                </Collapse>
              )}
            </>
          ))}
        </List>
      </div>

      <div className={styled.aboveMenu}></div>
    </div>
  );
};

export default AdminLeft;

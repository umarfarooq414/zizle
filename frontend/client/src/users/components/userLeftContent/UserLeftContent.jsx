import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from './style.module.css';
import UserIconHome from '../../../assets/images/userhomeicon.svg';
import UserAnnoucementIcon from '../../../assets/images/useraccouncementicon.svg';
import UserFavourites from '../../../assets/images/userfavicon.svg';
import UserProfileVisitor from '../../../assets/images/userprofileicon.svg';
import UserTopUpAccount from '../../../assets/images/topupaccount.svg';

import subscription from '../../../assets/images/subscription.svg';
import Image1Dice from '../../../assets/images/img1Dice.svg';
import Image2Dice from '../../../assets/images/img2Dice.svg';
import Logout from '../../../assets/images/userlogouticon.svg';
import UserCoin from '../../../assets/images/coinuser.svg';
import ProfileImage from '../../../assets/images/profile_pic.jpg';

import ProfilePage from '../../../assets/images/profilepage.svg';
import BlockMembers from '../../../assets/images/blockMembers.svg';
import FAQ from '../../../assets/images/faq.svg';
import ContactSupport from '../../../assets/images/contactSupport.svg';

// import UserHome from "../../../pages/userhome/UserHome";
import { useConnection } from '../../../socket/SocketConnection';
import { useSelector, useDispatch } from 'react-redux';
import { userCoinAction } from '../../../store/slices/userAuth/actions';
import { unwrapResult } from '@reduxjs/toolkit';
import { useMemo } from 'react';

import MenuIcon from '../../../assets/images/navMenu.png';
import MenuClose from '../../../assets/images/navClose.png';
import DarkScreen from '../../../assets/images/dark_screen.svg';
import LightScreen from '../../../assets/images/light_screen.svg';

import { Outlet } from 'react-router-dom';
import UserHeaderLogo from '../userHeaderLogo/UserHeaderLogo';
import UserHeaderButtons from '../userHeaderButtons/UserHeaderButtons';
import Footer from '../footer/Footer';
import { getRandomUser } from '../../../store/slices/customerAPI/action';
import { useUser } from '../../../providers/useUser';
import DarkModeContext from '../../../providers/DarkModeContext';
import { useTheme } from '@mui/material/styles';
import { styled as muiStyled } from '@mui/system';

const UserLeftContent = () => {
  const StyledLink = muiStyled(Link)(({ theme }) => ({
    color: theme.palette.text.primary, // Use the primary text color from the theme
  }));
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user, setToken, setUser } = useUser();
  const dataFetchedRef = useRef(false);
  const [isMobileVersionVisible, setIsMobileVersionVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { socket, userCount } = useConnection();
  const avatarImage = user?.profile?.avatarUrl;
  // const [isDarkMode, setIsDarkMode] = useState(false);
  const { isDarkMode, setDarkMode } = useContext(DarkModeContext);

  const screenIconClickHandler = () => {
    setDarkMode(!isDarkMode);
  };

  const [selectedItem, setSelectedItem] = useState('/subscription');
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const { usersCoins } = useSelector((state) => state?.userAuth);
  // const toggleMode = () => {
  //   setIsDarkMode((prevMode) => !prevMode);
  // };

  // const screenIconClickHandler = () => {
  //   toggleMode();
  // };
  useEffect(() => {
    const fetchUsersList = () => {
      if (localStorage.getItem('token')) dispatch(userCoinAction()).then(unwrapResult);
    };
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    fetchUsersList();
  }, []);

  const logout = () => {
    socket?.emit('logout', token);
    if (socket) {
      // setSocket(null);
      socket.disconnect();
    }
    setToken(null);
    setUser(null);
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

  const toggleMobileVersion = () => {
    setIsMobileVersionVisible(!isMobileVersionVisible);
  };

  const totalCount = useMemo(
    () => userCount?.reduce((totalCount, currentCount) => totalCount + currentCount.count, 0),
    [userCount],
  );

  const handleMenuToggle = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleMenuClose = () => {
    setIsMenuVisible(false);
  };

  const handleSurpriseMe = () => {
    dispatch(getRandomUser())
      .then(unwrapResult)
      .then((user) => {
        navigate(`/profile/${user?.id}`);
      })
      .catch((error) => {});
  };
  {
    /* -----------------------------------------for mobile view------------------------------------- */
  }
  return (
    <>
      <div
        className={isMenuVisible ? styled.mobileVersion : styled.desktopVersion}
        onClick={handleMenuToggle}
      >
        <img
          src={MenuIcon}
          alt=''
          style={{
            maxWidth: '100%',
            width: '20px',
            position: 'relative',
            left: '20px',
            top: '-45px',
            filter: isDarkMode ? 'invert(100%)' : 'none',
          }}
        />
      </div>

      <div
        className={isMenuVisible ? styled.desktopVersion : styled.mobileHidden}
        style={{
          backgroundColor: isDarkMode ? '#0f0f0f' : '#f7f7fe',
        }}
      >
        <div className={styled.userLeftNav}>
          <div className={styled.desktopVersion}>
            <img
              src={MenuClose}
              alt=''
              style={{
                maxWidth: '100%',
                width: '20px',
                top: '15px',
                right: '10px',
                position: 'absolute',
                filter: isDarkMode ? 'invert(100%)' : 'none',
              }}
              onClick={handleMenuClose}
            />
          </div>
          <ul>
            <li
              onClick={() => {
                handleMenuClose();
                handleItemClick('/userHome');
              }}
            >
              <Link to='/userHome'>
                <img
                  src={UserIconHome}
                  alt='as'
                  style={{ filter: isDarkMode ? 'invert(1)' : 'invert(0)' }}
                />
                <span
                  style={
                    selectedItem === '/userHome'
                      ? { color: theme.palette.primary.main }
                      : { color: theme.palette.text.primary }
                  }
                >
                  Home page
                </span>
              </Link>
            </li>

            <li
              onClick={() => {
                handleMenuClose();
                handleItemClick('/userAnnoucements');
              }}
            >
              <Link to='/userAnnoucements'>
                <img
                  src={UserAnnoucementIcon}
                  alt='as'
                  style={{ filter: isDarkMode ? 'invert(1)' : 'invert(0)' }}
                />
                {totalCount > 0 && <span className={styled.countNumber}>{totalCount}</span>}
                <span
                  style={
                    selectedItem === '/userAnnoucements'
                      ? { color: theme.palette.primary.main }
                      : { color: theme.palette.text.primary }
                  }
                >
                  News
                </span>
              </Link>
            </li>

            <li
              onClick={() => {
                handleMenuClose();
                handleItemClick('/userFavourites');
              }}
            >
              <Link to='/userFavourites'>
                <img
                  src={UserFavourites}
                  alt='as'
                  style={{ filter: isDarkMode ? 'invert(1)' : 'invert(0)' }}
                />
                <span
                  style={
                    selectedItem === '/userFavourites'
                      ? { color: theme.palette.primary.main }
                      : { color: theme.palette.text.primary }
                  }
                >
                  Favourites
                </span>
              </Link>
            </li>

            <li
              onClick={() => {
                handleMenuClose();
                handleItemClick('/userProfileVisitor');
              }}
            >
              <Link to='/userProfileVisitor'>
                <img
                  src={UserProfileVisitor}
                  alt='as'
                  style={{ filter: isDarkMode ? 'invert(1)' : 'invert(0)' }}
                />
                <span
                  style={
                    selectedItem === '/userProfileVisitor'
                      ? { color: theme.palette.primary.main }
                      : { color: theme.palette.text.primary }
                  }
                >
                  Profile Visitor
                </span>
              </Link>
            </li>
            <li
              style={selectedItem === '/subscription' ? { color: '#FF7048' } : {}}
              onClick={() => {
                handleMenuClose();
                handleItemClick('/subscription');
              }}
            >
              <Link
                to='/subscription'
                style={
                  selectedItem === '/subscription' ? { color: '#FF7048' } : { color: '#FF7048' }
                }
              >
                <img src={UserTopUpAccount} alt='as' />
                Top up account
              </Link>
            </li>
            <li
              onClick={() => {
                handleMenuClose();
                handleItemClick('/subscriptionpurchased');
              }}
            >
              <Link to='/subscriptionpurchased'>
                <img
                  src={subscription}
                  alt='as'
                  style={{ filter: isDarkMode ? 'invert(1)' : 'invert(0)' }}
                />
                <span
                  style={
                    selectedItem === '/subscriptionpurchased'
                      ? { color: theme.palette.primary.main }
                      : { color: theme.palette.text.primary }
                  }
                >
                  Subscriptions
                </span>
              </Link>
            </li>

            {/* --------------------------------for mobile view-------------------------------- */}
            <div className={styled.mainResoShows}>
              <li
                style={selectedItem === '/profile' ? { color: '#4B5563' } : {}}
                onClick={() => {
                  handleMenuClose();
                  handleItemClick('/profile');
                }}
              >
                <Link to='/profile' style={selectedItem === '/profile' ? { color: '#4B5563' } : {}}>
                  <img
                    src={ProfilePage}
                    alt='as'
                    style={{ filter: isDarkMode ? 'invert(1)' : 'invert(0)' }}
                  />
                  <span>Profile</span>
                </Link>
              </li>
              <li
                style={selectedItem === '/block-members' ? { color: '#4B5563' } : {}}
                onClick={() => {
                  handleMenuClose();
                  handleItemClick('/block-members');
                }}
              >
                <Link
                  to='/block-members'
                  style={selectedItem === '/block-members' ? { color: '#4B5563' } : {}}
                >
                  <img
                    src={BlockMembers}
                    alt='as'
                    style={{ filter: isDarkMode ? 'invert(1)' : 'invert(0)' }}
                  />
                  <span>Block Members</span>
                </Link>
              </li>
              <li
                style={selectedItem === '/fqa' ? { color: '#4B5563' } : {}}
                onClick={() => {
                  handleMenuClose();
                  handleItemClick('/fqa');
                }}
              >
                <Link to='/fqa' style={selectedItem === '/fqa' ? { color: '#4B5563' } : {}}>
                  <img
                    src={FAQ}
                    alt='as'
                    style={{ filter: isDarkMode ? 'invert(1)' : 'invert(0)' }}
                  />
                  <span>FAQ</span>
                </Link>
              </li>
              <li
                style={selectedItem === '/contact-support' ? { color: '#4B5563' } : {}}
                onClick={() => {
                  handleMenuClose();
                  handleItemClick('/contact-support');
                }}
              >
                <Link
                  to='/contact-support'
                  style={selectedItem === '/contact-support' ? { color: '#4B5563' } : {}}
                >
                  <img
                    src={ContactSupport}
                    alt='as'
                    style={{ filter: isDarkMode ? 'invert(1)' : 'invert(0)' }}
                  />
                  <span style={{ color: '#db2777' }}>Contact support</span>
                </Link>
              </li>
            </div>
            <li>
              <img
                src={Logout}
                alt='logout'
                style={{ filter: isDarkMode ? 'invert(1)' : 'invert(0)' }}
              />
              <button onClickCapture={logout} style={{ color: theme.palette.text.primary }}>
                Logout
              </button>
            </li>
          </ul>
          <div className='clear'></div>
        </div>
        {/* -------------------------------------------------------------------------------------- */}
        <div className={styled.UserleftSuprise} onClick={() => handleSurpriseMe()}>
          <img
            className={`${styled.img1dice} ${styled.animate_dice_roll}`}
            src={Image1Dice}
            alt=''
          />
          <img
            className={`${styled.img2dice} ${styled.animate_dice2_roll}`}
            src={Image2Dice}
            alt=''
          />
          <span className={styled.surpriseMe}>Surprise me!</span>
          <p>Dice and let yourself be suprised!</p>
          <div className='clear'></div>
        </div>
        {/* <div className={styled.userCopyright}>
          <ul>
            <li>
              <Link to='/data-protection'>Data protection</Link>
            </li>
            <li>
              <Link to='/term-of-use'>Term of Use</Link>
            </li>
            <li>
              <Link to='/imprint'>Imprint</Link>
            </li>
          </ul>
          <p>Contact &copy; - Zizle - Made with &#10084;</p>
          <div className='clear'></div>
        </div> */}
        <div>
          <div className={styled.profileSec}>
            <div className={styled.imgUser}>
              {avatarImage === null ? (
                <img src={ProfileImage} alt='' />
              ) : (
                <img src={avatarImage} alt='' />
              )}
            </div>
            <div className={styled.contentUuser}>
              <h3 style={{ color: theme.palette.text.primary }}>{user?.userName ?? 'USER NAME'}</h3>
              <Link to='/subscription'>
                <img src={UserCoin} alt='' />
                <p style={{ color: theme.palette.text.primary }}>
                  <span>{usersCoins} coins </span>
                </p>
              </Link>
            </div>
            <div className='clear'></div>
            <div className={styled.darkLightMode}>
              {!isDarkMode ? (
                <div className={styled.darkMode}>
                  <img src={DarkScreen} alt='Dark Screen Icon' onClick={screenIconClickHandler} />
                </div>
              ) : (
                <div className={styled.lightMode}>
                  <img src={LightScreen} alt='Light Screen Icon' onClick={screenIconClickHandler} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const PageWrapper = () => {
  const [isMobileVersionVisible, setIsMobileVersionVisible] = useState(false);

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

  return (
    <div className={styled.mainContainer}>
      <div className={styled.userHeaderSec}>
        <div className='logoSec'>
          <UserHeaderLogo />
        </div>
        <div className='logoSec'>
          <UserHeaderButtons />
        </div>
      </div>
      <div className={styled.mainContainerInner}>
        <div
          className={`${styled.UserLeftNavigation} ${
            isMobileVersionVisible ? styled.mobileVersions : styled.desktopVersions
          }`}
        >
          <UserLeftContent />
          <div className={styled.usernaviright}>
            <Outlet />
          </div>
          <div className={styled.clear}></div>
        </div>
        <div className={styled.footer}>
          <Footer />
        </div>
      </div>
    </div>
  );
};
export default PageWrapper;

import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from './style.module.css';
import UserNotification from '../userNotification/UserNotification';
import DarkModeContext from '../../../providers/DarkModeContext';

const UserHeaderButtons = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Initial check for device width on component mount
    handleResize();

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      {isMobile && <UserNotification />}
      <ul className={styled.header_btns}>
        <li>
          <Link to='/profile'>Profile</Link>
        </li>
        <li>
          <Link to='/block-members'>Block Members</Link>
        </li>
        <li>
          <Link to='/fqa'>FQA</Link>
        </li>
        <li className={styled.contactSupport}>
          <Link to='/contact-support'>Contact Support</Link>
        </li>
        <li className={styled.notiMainIcons} style={{ fill: isDarkMode ? '#fff' : '#000' }}>
          {!isMobile && <UserNotification />}
        </li>
      </ul>
    </div>
  );
};

export default UserHeaderButtons;

/* eslint-disable no-undef */
import { unwrapResult } from '@reduxjs/toolkit';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import UserFavourtiesIcon from '../../../assets/images/favourties_icon.svg';
import {
  blockedUsersListAction,
  removeFromBlockListAction,
} from '../../../store/slices/customerAPI/action.js';
import styled from './style.module.css';
import { useUser } from '../../../providers/useUser';
import TickPopup from '../../../assets/images/tickPopup.svg';
import CloseIcon from '../../../assets/images/navClose.png';

import DarkModeContext from '../../../providers/DarkModeContext';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import MaleAvatr from '../../../assets/images/male.png';
import FemaleAvatr from '../../../assets/images/female.png';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  backgroundColor: '#16a34a',
  background: '#16a34a',
  boxShadow: 24,
  p: 4,
};

const SettingTabBlockMembers = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [blockedListData, setblockedListData] = useState([]);

  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  const dispatch = useDispatch();
  const { token, blockedUser, setBlockedUser } = useUser();
  const blockedProfileList = () => {
    const payload = {
      token,
    };
    dispatch(blockedUsersListAction(payload))
      .then(unwrapResult)
      .then((result) => {
        setblockedListData(result);
        setBlockedUser(result);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    blockedProfileList();
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [blockedUser]);

  function calculateAge(birthDateString) {
    var birthDate = new Date(birthDateString);
    var difference = Date.now() - birthDate.getTime();
    var ageDate = new Date(difference);
    var calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    return calculatedAge ? calculatedAge : '';
  }

  const handleUnBlockClick = async (index) => {
    const blockedUnBlockedUser = blockedUser[index]?.blocked;
    if (blockedUnBlockedUser) {
      const payload = {
        id: blockedUnBlockedUser.id,
        token,
      };
      await dispatch(removeFromBlockListAction(payload));
      setOpen(true);
      setblockedListData((prevList) => {
        const updatedList = [...prevList];
        updatedList.splice(index, 1);
        return updatedList;
      });
    }
  };

  const isSmallScreen = screenWidth <= 786;
  return (
    <Fragment>
      <div className={styled.profileVisitmain}>
        <div className={styled.textContent}>
          <h3>Block members</h3>
          <p>
            Here you can find blocked members. If you encountered a problem, please{' '}
            <Link to='/contact-support' style={{ color: '#db2777' }}>
              {' '}
              contact support
            </Link>
            .
          </p>
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style} className={styled.modelPopup}>
            <Button
              onClick={handleClose}
              className={`${styled.closeBtnModal}`}
              style={{ background: 'transparent' }}
            >
              <img src={CloseIcon} alt='cross icon' />
            </Button>
            <img src={TickPopup} alt='' />
            <Typography
              id='modal-modal-title'
              variant='h6'
              component='h2'
              style={{ color: '#fff' }}
            >
              Erfolg!
            </Typography>
            <Typography id='modal-modal-description' sx={{ mt: 2 }} style={{ color: '#fff' }}>
              Benutzer gemeldet. Regelverstöße werden untersucht.
            </Typography>
          </Box>
        </Modal>

        {blockedUser?.length === 0 ? (
          <div className={styled.ProfileVisitMessage}>
            <img src={UserFavourtiesIcon} alt='a' />
            <p>Creepy, there &apos; s nothing here.</p>
          </div>
        ) : (
          blockedListData?.map((listBlockedData, index) => (
            <div
              className={styled.ProfileVisitInner}
              style={{ backgroundColor: isDarkMode ? '#282727' : 'white' }}
            >
              <table width='100%' cellPadding={0} cellSpacing={0} className={styled.tableBlockUser}>
                <tr>
                  <td>Avatar</td>
                  <td>Nickname</td>
                  <td>Date</td>
                  <td>Setting</td>
                </tr>
                <tr>
                  <td>
                    <div className={styled.lockProfile}>
                      {!listBlockedData?.blocked?.profile?.avatarUrl ? (
                        listBlockedData?.blocked?.selfGender === 'MALE' ? (
                          <img src={MaleAvatr} alt='' />
                        ) : (
                          <img src={FemaleAvatr} alt='' />
                        )
                      ) : (
                        <img src={`${listBlockedData?.blocked?.profile?.avatarUrl}`} alt='' />
                      )}
                    </div>
                  </td>
                  <td>
                    <h4 style={{ color: 'black', wordBreak: 'break-all' }}>
                      {listBlockedData?.blocked?.userName}
                    </h4>
                  </td>
                  <td>
                    <h4 style={{ color: isDarkMode ? '#fff' : 'black' }}>
                      {listBlockedData?.blocked?.updatedAt.split('T')[0]}
                    </h4>
                  </td>
                  <td>
                    <h4
                      onClick={() => handleUnBlockClick(index)}
                      style={{ textDecoration: 'underline' }}
                    >
                      <p>Remove barriers</p>
                    </h4>
                  </td>
                </tr>
              </table>
            </div>
          ))
        )}
        <div className={styled.clear}></div>
      </div>
    </Fragment>
  );
};
export default SettingTabBlockMembers;

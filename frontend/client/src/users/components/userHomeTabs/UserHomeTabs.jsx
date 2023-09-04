import React, { useEffect, useState, useCallback, useContext } from 'react';
import { Box, Tab, Tabs, Modal } from '@mui/material';
import { makeStyles, Theme } from '@material-ui/core/styles';
import HomeUserNew from '../homeUserNew/HomeUserNew';
import HomeUserOnline from '../homeUserOnline/HomeUserOnline';
import styled from './style.module.css';
import HomeUserFSK from '../homeUserFSK/HomeUserFSK';
import HomeUserIntresting from '../homeUserIntresting/HomeUserIntresting';
import { customerListAction } from '../../../store/slices/userAuth/actions';
import { unwrapResult } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { useUser } from '../../../providers/useUser';
import treasure from '../../../assets/images/treasure2.png';
import CloseIcon from '../../../assets/images/navClose.png';
import { Button } from '@material-ui/core';
import { useNavigate, useLocation } from 'react-router-dom';
import DarkModeContext from '../../../providers/DarkModeContext';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  height: '80vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  overflow: 'hidden',
  overflowY: 'scroll',
  p: 4,
};
const useStyles = makeStyles(() => ({
  // root: {
  //   backgroundColor: 'transparent !important',
  // },
  root: {
    flexGrow: 1,
    backgroundColor: 'transparent !important',
    '&.dark-mode': {
      backgroundColor: '#0f0f0f',
    },
  },
  tab: {
    background: '#f7f7ff !important',
    backgroundColor: '#f7f7ff !important',
    color: '#000000',
    '&.Mui-selected': {
      background: '#fff !important',
      color: '#000000 !important',
      borderTopLeftRadius: '15px !important',
      borderTopRightRadius: '15px !important',
      marginLeft: '15px !important',
    },
    '.dark-mode &': {
      background: '#0f0f0f !important',
      color: '#ffffff',
      paddingLeft: '10px !important',
      paddingRight: '10px !important',
      '&.Mui-selected': {
        background: '#222222 !important',
        color: '#ffffff !important',
        borderTopLeftRadius: '15px !important',
        borderTopRightRadius: '15px !important',
        // marginLeft: '15px',
      },
    },
  },
}));

const UserHomeTabs = (props) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const location = useLocation();
  const { state } = location;
  const propEmail = state?.userObj;
  const navigate = useNavigate();
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const classes = useStyles();
  const tabClasses = { root: classes.tab };
  const [tabIndex, setTabIndex] = useState(0);
  const [userList, setUserList] = useState('');
  const [pageCount, setPageCount] = useState(1);
  const [nextPageCount, setNextPageCount] = useState(userList?.nextPage);
  const [numResults, setNumResults] = useState(userList?.pageSize);
  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };
  const dispatch = useDispatch();
  const { token, user, setToken, setUser } = useUser();

  const fetchUsersList = useCallback(async (tabIndex) => {
    var onlineCustomers = 0;
    var fskCustomers = false;
    var newCustomers = false;
    tabIndex === 2 ? (onlineCustomers = 1) : (onlineCustomers = 0);
    tabIndex === 1 ? (newCustomers = true) : (newCustomers = false);
    tabIndex === 3 ? (fskCustomers = true) : (fskCustomers = false);

    const payload = {
      page: 1,
      pageSize: 8,
      status: onlineCustomers,
      newUsers: newCustomers,
      fsk: fskCustomers,
      token,
    };

    // dispatch(customerListAction(payload))
    //   .then(unwrapResult)
    //   .then((result) => {
    //     setUserList(result.data);
    //   })
    if (token === null) {
      setTransactionModalOpen(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsersList(tabIndex);
    }, 1000);
    return () => clearTimeout(timer);
  }, [fetchUsersList, tabIndex]);

  return (
    <div className={styled.homeNewUsersTabs}>
      <Box>
        <Box
          sx={{ width: '100%', bgcolor: 'transparent', borderRadiusTop: '5px' }}
          className={isDarkMode ? 'dark-mode' : ''}
        >
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            sx={{ width: '100%', bgcolor: 'background.paper' }}
            inkBarStyle={{ color: 'yellow' }}
            TabIndicatorProps={{
              style: { background: 'transparent', height: 0 },
            }}
            className={classes.root}
          >
            <Tab
              label='Intresting'
              sx={{ width: '25%', bgcolor: 'background.paper', fontSize: '12px' }}
              className={classes.tab}
            />
            <Tab
              label='On-line'
              sx={{ width: '25%', bgcolor: 'background.paper', fontSize: '12px' }}
              className={classes.tab}
            />
            <Tab
              label='New'
              sx={{ width: '25%', bgcolor: 'background.paper', fontSize: '12px' }}
              classes={tabClasses}
            />
            <Tab
              label='FSK'
              sx={{ width: '25%', bgcolor: 'background.paper', fontSize: '12px' }}
              classes={tabClasses}
            />
          </Tabs>
        </Box>
        <Box sx={{}}>
          {tabIndex === 0 && (
            <Box>
              <HomeUserIntresting listData={userList} />
            </Box>
          )}
          {/* {!!userList?.data?.length &&
          <> */}
          {tabIndex === 2 && (
            <Box>
              <HomeUserNew listData={userList} />
            </Box>
          )}
          {tabIndex === 1 && (
            <Box>
              <HomeUserOnline listData={userList} />
            </Box>
          )}
          {tabIndex === 3 && (
            <Box>
              <HomeUserFSK listData={userList} />
            </Box>
          )}
          {/* </>
          } */}
        </Box>
      </Box>

      {/* *********TransactionFailedModal************* */}
      <Modal
        open={transactionModalOpen}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <Box
          sx={{
            ...style,
            width: window.innerWidth <= 768 ? '250px' : '360px',
            overflowY: 'hidden',
            height: '300px',
            borderRadius: '10px',
            textAlign: 'center',
            zIndex: '9999',
          }}
        >
          {/* <img
            style={{
              height: '120px',
              display: 'block',
              margin: '10px auto 20px',
            }}
            src={treasure}
            alt='cross icon'
          /> */}
          <h2
            style={{
              textAlign: 'center',
              color: 'rgba(0,0,0,.7)',
              // fontSize: '14px',
              lineHeight: '20px',
              margin: '0px 0px 10px;',
            }}
            id='parent-modal-title'
          >
            Du hast es fast geschafft!
          </h2>
          <h3
            className={styled.errorOnReg}
            style={{
              textAlign: 'center',
              color: '#827c7c',
              fontSize: '14px',
              fontWeight: 'normal',
              lineHeight: '20px',
              margin: '0px 0px 10px;',
            }}
            id='parent-modal-title'
          >
            Bitte prüfe deinen Posteingang. Wir haben dir eine Verifizierungs-Email gesendet an:
          </h3>
          <h3
            style={{
              textAlign: 'center',
              color: 'black',
              fontSize: '14px',
              fontWeight: 'bolder',
              lineHeight: '20px',
              margin: '0px 0px 10px;',
            }}
            id='parent-modal-title'
          >
            {propEmail?.email}
          </h3>
          <h3
            className='errorOnReg'
            style={{
              textAlign: 'center',
              color: '#827c7c',
              fontSize: '14px',
              fontWeight: 'normal',
              lineHeight: '20px',
              margin: '0px 0px 10px;',
            }}
            id='parent-modal-title'
          >
            Keine E-Mail erhalten?
            <br />
            Du findest die E-Mail nicht im Posteingang oder Spam-Ordner?
          </h3>
          {/* <Button
            onClick={() => {
              navigate('/subscription');
            }}
            sx={{
              // backgroundColor: 'blue',
              border: '1px solid #f99b5f',
              borderRadius: '20px',
              color: 'white',
              fontWeight: 'bolder',
              backgroundColor: '#f99b5f',
              padding: '8px 30px',
              transition: 'all 0.3s ease-in',
              '&:hover': {
                backgroundColor: '#f99b31',
                padding: '8px 30px',
                transform: 'scale(1.05)',
                borderRadius: '40px',
                transition: 'all 0.3s ease-in',
              },
            }}
          >
            Email erneut senden
          </Button><br /> */}
          <Button
            className={styled.btnLoginMain}
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setToken(null);
              setUser(null);
              navigate('/login');
            }}
            // sx={{
            //   // backgroundColor: 'blue',
            //   border: '1px solid #f99b5f',
            //   borderRadius: '20px',
            //   color: 'white',
            //   fontWeight: 'bolder',
            //   backgroundColor: '#f99b5f',
            //   padding: '8px 30px',
            //   transition: 'all 0.3s ease-in',
            //   '&:hover': {
            //     backgroundColor: '#f99b31',
            //     padding: '8px 30px',
            //     transform: 'scale(1.05)',
            //     borderRadius: '40px',
            //     transition: 'all 0.3s ease-in',
            //   },
            // }}
          >
            Ausloggen
          </Button>
        </Box>
      </Modal>

      {/* ********************** */}
    </div>
  );
};

export default UserHomeTabs;

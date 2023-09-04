import { ClassNames } from '@emotion/react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
// import UserVerified from '../../../assets/images/badgeIcon.svg';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
// import { styled } from './style.module.css';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useCallback, useEffect, useState } from 'react';
import Switch from 'react-ios-switch';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import UserVerified from '../../../assets/images/badgeIcon.svg';
import { customerListAction } from '../../../store/slices/userAuth/actions';
import style from './style.module.css';
import {
  blockedUsersListAction,
  profileVisitorList,
  visitedProfile,
} from '../../../store/slices/customerAPI/action';
import MaleAvatr from '../../../assets/images/male.png';
import FemaleAvatr from '../../../assets/images/female.png';
import { useUser } from '../../../providers/useUser';
import { MODAL_TYPES, useGlobalModalContext } from '../../../globalPopups/GlobalModal';
import { Button } from '@mui/material';
import DarkModeContext from '../../../providers/DarkModeContext';
import { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
// import { Button, ButtonVariant } from "@patternfly/react-core";
const CustomSliderStyles = {
  '& .MuiSlider-thumb': {
    color: '#fa5f36',
  },
  '& .MuiSlider-track': {
    color: '#f9c8b3',
  },
  '& .MuiSlider-rail': {
    color: '#acc4e4',
  },
  '& .MuiSlider-active': {
    color: '#f5e278',
  },
};

const styles = (theme) => ({
  textField: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: 0,
    marginTop: 0,
    fontWeight: 500,
  },
  input: {
    color: 'white',
  },
});

const HomeUserIntresting = (props) => {
  const theme = useTheme();
  const { isDarkMode } = useContext(DarkModeContext);
  const getMarkLabel = (value) => {
    const count = Math.floor(value / 1); // Assuming steps of 10
    return `${count}`;
  };
  const { showModal } = useGlobalModalContext();
  // const transactionFailedModal = () => {
  //   showModal(MODAL_TYPES.TRANSACTION_FAILED_MODAL);
  // };
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(false);
  // const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [nextPage, setNextPage] = useState(2);
  const [showwomen, setShowwomen] = useState(false);
  const [postalcode, setPostalcode] = useState('');
  const [showmen, setShowmen] = useState(false);
  const [username, setUsername] = useState('');
  const [distance, setDistance] = useState('');
  const [listData, setListData] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  // const [blockedListData, setblockedListData] = useState([]);
  const { token, blockedUser, setBlockedUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(listData?.page);

  const dispatch = useDispatch();
  const [value, setValue] = useState([18, 65]);

  const handleChange1 = (event, newValue) => {
    setValue(newValue);
  };
  function valuetext(value) {
    return `${value} km`;
  }
  function calculateAge(birthDateString) {
    var birthDate = new Date(birthDateString);
    var difference = Date.now() - birthDate.getTime();
    var ageDate = new Date(difference);
    var calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    return calculatedAge ? calculatedAge : '';
  }

  const fetchUsersList = useCallback(
    async (value, showwomen, showmen, username, postalcode, distance) => {
      var genderValue = '';
      if (!showmen && !showwomen) {
        genderValue = '';
      } else if (showwomen) {
        genderValue = 'female';
      } else if (showmen) {
        genderValue = 'male';
      }
      const payload = {
        page: 1,
        pageSize: 8,
        gender: genderValue,
        nickname: username,
        startAge: value[0],
        endAge: value[1],
        distanceInKms: distance,
        postalCode: postalcode,
        token: token,
      };

      dispatch(customerListAction(payload))
        .then(unwrapResult)
        .then((result) => {
          setIsLoading(false);
          setListData(result.data);
          // setNextPage(result.nextPage)
        })
        .catch((error) => {});

      dispatch(blockedUsersListAction(payload.token))
        .then(unwrapResult)
        .then((result) => {
          // setblockedListData(result);
          setBlockedUser(result);
        })
        .catch((error) => {});
    },
    [],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsersList(value, showwomen, showmen, username, postalcode, distance);
    }, 1000);
    return () => clearTimeout(timer);
  }, [value, showwomen, showmen, username, postalcode, distance, token]);

  const handleShowMorePosts = () => {
    // setNextPage(1 + nextPage) // Get the next page count
    const payload = {
      page: nextPage,
      pageSize: 8,
      token: token,
    };
    if (nextPage !== null) {
      setLoading(true); // Show loading spinner
    }

    dispatch(customerListAction(payload))
      .then(unwrapResult)
      .then((result) => {
        result = result.data;
        const newResults = result.data;
        setNextPage(result.nextPage);
        setListData((prevListData) => ({
          data: [...prevListData.data, ...newResults],
          nextPage: result.nextPage,
        }));
        setPageCount(newResults.nextPage);
        setLoading(false); // Hide loading spinner
      })
      .catch((error) => {
        setLoading(false); // Hide loading spinner
      });
  };
  // const handleInputChange = (e) => {
  //   setUsername(e.target.value);
  // };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setUsername(inputValue);
  };

  const useStyles = makeStyles((theme) => ({
    root: { backgroundColor: 'transparent' },
    box: { backgroundColor: 'transparent' },
    input: {
      root: { backgroundColor: 'transparent', color: 'black' },
    },
  }));

  const toggleDivVisibility = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdvancedSearchVisible(!isAdvancedSearchVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobileScreen(true);
        setIsAdvancedSearchVisible(false);
      } else {
        setIsMobileScreen(false);
        setIsAdvancedSearchVisible(true);
      }
    };

    // Attach the resize event listener
    window.addEventListener('resize', handleResize);

    // Call the handleResize function initially to handle the initial screen width
    handleResize();

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const navigate = useNavigate();

  const goToUser = (user) => {
    dispatch(visitedProfile(user.id));
    navigate(`/profile/${user?.id}`);
  };

  const filteredData = listData?.data?.filter((user) => {
    const blocked = blockedUser?.find((blockedUser) => blockedUser?.blocked?.id === user?.id);
    return blocked === undefined;
  });
  return (
    <div>
      {/* <>
        <Button sx={{
          backgroundColor: '#308af3',
          border: '1px solid #cbcbcb',
          borderRadius: '4px',
          color: 'white',
          padding: '8px 16px',
          '&:hover': {
            backgroundColor: '#287edf',
          },
        }}
          onClick={transactionFailedModal}>
          Transaction fail modal
        </Button>
      </> */}
      <div className={style.homeUserNewform}>
        <form className={isDarkMode ? style.filterFormDark : style.filterForm}>
          <div className={style.gridItem}>
            <div className={style.grid}>
              <div className={style.genderFilterButtonWrapper}>
                <div className={style.gridItem}>
                  <Stack direction='row' spacing={1} height={50}>
                    <Switch
                      checked={showwomen}
                      onChange={() => {
                        setShowwomen(!showwomen);
                        setShowmen(false);
                      }}
                      style={{
                        backgroundColor: isDarkMode ? '#3f3c3c' : '#e5e7eb',
                        border: 'none',
                      }}
                    />
                    <p>Show Women</p>
                  </Stack>
                </div>

                <div
                  className={style.gridItem}
                  style={{ display: !isMobileScreen ? 'none' : 'block' }}
                >
                  <Stack direction='row' spacing={1} height={10}>
                    <Switch
                      checked={showmen}
                      onChange={() => {
                        setShowmen(!showmen);
                        setShowwomen(false);
                      }}
                      style={{
                        backgroundColor: isDarkMode ? '#3f3c3c' : '#e5e7eb',
                        border: 'none',
                      }}
                    />
                    <p>Show Men</p>
                  </Stack>
                </div>
              </div>
              {/* </>
              )} */}

              <div className={style.gridItem}>
                <FormControl fullWidth>
                  <TextField
                    id='outlined-basic'
                    // label='Username'
                    placeholder='Username'
                    variant='outlined'
                    value={username}
                    onChange={handleInputChange} // update this line
                    className={ClassNames.textField}
                    sx={{
                      position: 'relative',
                      borderRadius: '50',
                    }}
                    InputProps={{
                      sx: {
                        color: isDarkMode ? '#fff' : '#000',
                        background: isDarkMode ? '#0f0f0f' : ' rgb(247, 247, 254);',
                        borderRadius: 50,
                        // height: "2.25rem"
                      },
                    }}
                  />
                </FormControl>
              </div>

              {isAdvancedSearchVisible && (
                <>
                  {/* {isMobileScreen && (
                    <> */}
                  <div className={style.gridItem}>
                    <FormControl fullWidth>
                      <TextField
                        id='outlined-basic'
                        // label='Postal Code'
                        placeholder='Postal Code'
                        variant='outlined'
                        className={ClassNames.textField}
                        value={postalcode}
                        onChange={(e) => setPostalcode(e.target.value)}
                        InputProps={{
                          sx: {
                            color: isDarkMode ? '#fff' : '#000',
                            background: isDarkMode ? '#0f0f0f' : ' rgb(247, 247, 254);',
                            borderRadius: 50,
                            borderStyle: 'none',
                            // height: "2.25rem"
                          },
                          startAdornment: (
                            <InputAdornment position='start'>
                              <LocationOnIcon style={{ color: isDarkMode ? '#fff' : '#000' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </div>

                  <div
                    className={style.gridItem}
                    style={{ display: isMobileScreen ? 'none' : 'block' }}
                  >
                    <Stack direction='row' spacing={1}>
                      <Switch
                        checked={showmen}
                        onChange={() => {
                          setShowmen(!showmen);
                          setShowwomen(false); // Close "Show Women" option
                        }}
                        style={{
                          backgroundColor: isDarkMode ? '#3f3c3c' : '#e5e7eb',
                          border: 'none',
                        }}
                      />
                      <p style={{ marginTop: '5px' }}>Show Men</p>
                    </Stack>
                  </div>
                  <div className={style.gridItem}>
                    <div className={style.slider} style={{ margin: '0px 10px' }}>
                      <Typography
                        style={{ color: isDarkMode ? '#fff' : '#000', textAlign: 'left' }}
                        id='range-slider'
                        gutterBottom
                      >
                        Old <span style={{ float: 'right' }}>{value.join('-')}</span>
                      </Typography>
                      <Slider
                        value={value}
                        min={18}
                        max={65}
                        onChange={handleChange1}
                        valueLabelDisplay='auto'
                        aria-labelledby='range-slider'
                        getAriaValueText={valuetext}
                        // defaultValue={}
                        sx={CustomSliderStyles}
                      />
                    </div>
                  </div>
                  <div className={style.gridItem}>
                    <div className={style.slider} style={{ margin: '0px 10px' }}>
                      <Typography
                        style={{ color: isDarkMode ? '#fff' : '#000', float: 'left' }}
                        id='range-slider'
                        gutterBottom
                      >
                        Distance
                      </Typography>
                      <Typography
                        style={{ color: isDarkMode ? '#fff' : '#000', textAlign: 'right' }}
                        id='range-slider'
                        gutterBottom
                      >
                        {distance}kms
                      </Typography>
                      <Slider
                        aria-label='Temperature'
                        value={distance}
                        onChange={(e, newValue) => setDistance(newValue)}
                        getAriaValueText={valuetext}
                        valueLabelDisplay='auto'
                        valueLabelFormat={valuetext}
                        step={10}
                        marks={[
                          { value: 0, label: getMarkLabel(0) },
                          { value: 10, label: getMarkLabel(10) },
                          { value: 20, label: getMarkLabel(20) },
                          { value: 30, label: getMarkLabel(30) },
                          { value: 40, label: getMarkLabel(40) },
                          { value: 50, label: getMarkLabel(50) },
                          { value: 60, label: getMarkLabel(60) },
                          { value: 70, label: getMarkLabel(70) },
                          { value: 80, label: getMarkLabel(80) },
                          { value: 90, label: getMarkLabel(90) },
                          { value: 100, label: getMarkLabel(100) },
                        ]}
                        min={0}
                        max={100}
                        sx={CustomSliderStyles}
                      />
                    </div>
                  </div>

                  {/* </>
                  )} */}
                </>
              )}
              {isMobileScreen && (
                <div className={style.gridItem1}>
                  <div className={style.slider}>
                    <button
                      className={style.advanceSearchButton}
                      onClick={toggleDivVisibility}
                      style={{ background: 'transparent' }}
                    >
                      <span className={style.advanceSearchButtonText}>
                        {isAdvancedSearchVisible ? 'Close' : 'Advanced Search'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
        <div className={style.clear}></div>
      </div>
      <div className={style.homeUserNewMain1}>
        {isLoading ? (
          <CircularProgress color='secondary' style={{ marginLeft: '50%' }} />
        ) : (
          <>
            {filteredData?.map((userDataModal) => (
              <div className={style.homeUserNewInner}>
                <div onClick={() => goToUser(userDataModal)}>
                  <div className={style.userImage}>
                    {userDataModal?.profile?.avatarUrl === null ? (
                      userDataModal?.selfGender === 'Male' ? (
                        <img src={MaleAvatr} alt='' />
                      ) : (
                        <img src={FemaleAvatr} alt='' />
                      )
                    ) : (
                      <img src={`${userDataModal?.profile?.avatarUrl}`} alt='' />
                    )}
                  </div>
                  <div className={style.homeUserNewDetails}>
                    <h3>
                      {userDataModal?.userName} ,{' '}
                      {calculateAge(userDataModal?.profile?.dateOfBirth)}
                      {userDataModal?.profile?.isProfileVerified === 'VERIFIED' && (
                        <div className={style.homeUserNewVerified}>
                          <img src={UserVerified} alt='' />
                        </div>
                      )}
                    </h3>
                    <h3>
                      <LocationOnIcon style={{ width: '18px', float: 'left' }} />
                      {userDataModal?.address?.address
                        ? userDataModal?.address?.address.slice(0, 2) + 'XXX'
                        : `63XXX`}
                    </h3>
                  </div>

                  <div className={style.homeUserNewOnline}>
                    <div
                      className={
                        userDataModal?.online
                          ? style.homeUserNewOnlineIcon
                          : style.homeUserNewOfflineIcon
                      }
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        {nextPage !== null && (
          <button
            className={style.loadMoreBtn}
            onClick={handleShowMorePosts}
            disabled={nextPage === null}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )}
        {/* )} */}
        {/* <button onClick={handleShowMorePosts}>Load more</button> */}
      </div>
    </div>
  );
};

export default HomeUserIntresting;

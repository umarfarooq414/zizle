import React, { useState, useMemo } from 'react';
import style from './style.module.css';
import Stack from '@mui/material/Stack';
import {
  FormControl,
  InputAdornment,
  Slider,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core';
import { ClassNames } from '@emotion/react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useTable } from 'react-table';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useRef } from 'react';
import {
  getCustomers,
  scheduleMessage,
  sendSpamMessages,
  customerListAction,
} from '../../../../store/slices/adminAPI/actions';
import { toast } from 'react-toastify';

import { useEffect } from 'react';
import { useCallback } from 'react';
import { fakeUserListAction } from '../../../../store/slices/userAuth/actions';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import MessageIcon from '@mui/icons-material/Message';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ReplayIcon from '@mui/icons-material/Replay';
import { useUser } from '../../../../providers/useUser';

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
  '& .MuiSlider-label': {
    color: '#000',
  },
};

const MultiMessage = () => {
  const { token, setBlockedUser } = useUser();
  // const tokenItem = localStorage.getItem("token");
  // const { token } = tokenItem ? JSON.parse(tokenItem) : {};
  const [showwomen, setShowwomen] = useState(false);
  const [showmen, setShowmen] = useState(false);
  const [username, setUsername] = useState('');
  const [time, setTime] = useState(0);
  const [online, setOnline] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [fsk, setFsk] = useState(false);
  const [postalcode, setPostalcode] = useState('');
  const [age, setAge] = useState(['18', '65']);
  const [message, setMessage] = useState(``);
  const [fakeUsers, setFakeUsers] = useState([]);
  const [recipients, setRecipients] = useState(0);
  const [customerIds, setCustomerIds] = useState([]);
  const [selectedUser, setSelectedUser] = useState(0);
  const [file, setFile] = useState(``);
  const [filePreview, setFilePreview] = useState('');
  const [ageChanged, setAgeChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listData, setListData] = useState('');
  const [distance, setDistance] = useState('');

  const dispatch = useDispatch();
  const [value, setValue] = useState([18, 65]);
  const handleChange1 = (event, newValue) => {
    setValue(newValue);
  };
  function valuetext(value) {
    return `${value} km`;
  }
  const getMarkLabel = (value) => {
    const count = Math.floor(value / 1);
    return `${count}`;
  };

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
    },
    [],
  );

  useEffect(() => {
    let genderValue = '';
      if (!showmen && !showwomen) {
        genderValue = '';
      } else if (showwomen) {
        genderValue = 'female';
      } else if (showmen) {
        genderValue = 'male';
      }
    if (token) {
      setTimeout(() => {
        let payload = {
          gender: genderValue,
          nickname: username,
          postalCode: postalcode,
          schedule: true,
          online: online,
          newUser: newUser,
          fsk: fsk,
        };
        console.log(payload, 'payloadfrom');

        if (ageChanged) {
          payload.startAge = age[0];
          payload.endAge = age[1];
        }
        dispatch(getCustomers(payload))
          .then(unwrapResult)
          .then((result) => {
            setCustomerIds(result.data?.data?.map((data) => data.id));
            setRecipients(result?.data?.total);
          });
      }, 100);
    }
  }, [value, showwomen, showmen, username, postalcode, distance, token, online, newUser, fsk]);

  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  const sendSpamMessage = (e) => {
    if (customerIds.length === 0) {
      toast.error('There is no user selected to send spam message!', {
        position
          : 'top-right'
      })
      return;
    }
    e.preventDefault();
    dispatch(
      sendSpamMessages({
        fakeUserId: selectedUser?.id,
        customerUserIds: customerIds,
        message: message,
        file: file,
      }),
    )
      .then(unwrapResult)
      .then((result) => {
        if (result?.data) {
          setMessage(``);
        }
      });
  };

  const getFakeUsers = () => {
    dispatch(fakeUserListAction())
      .then(unwrapResult)
      .then((result) => {
        setFakeUsers(result.data);
      });
  };

  const data = useMemo(
    () =>
      fakeUsers?.map((data) => {
        return {
          name: data.userName,
          email: data.email,
          select: { id: data.id, name: data.userName },
        };
      }),
    [fakeUsers],
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name', // accessor is the "key" in the data
      },
      {
        Header: 'Email',
        accessor: 'email', // accessor is the "key" in the data
      },
      {
        Header: 'Origin',
        accessor: 'origin',
      },
      {
        Header: 'Activity',
        accessor: 'activity',
      },
      {
        Header: 'Verified',
        accessor: 'verified',
      },
      {
        Header: 'Select',
        accessor: 'select',
        Cell: ({ cell }) => (
          <button
            className={style.selectButtonMulti}
            value={cell.row.values.name}
            onClick={() => setSelectedUser(cell.value)}
          >
            Select
          </button>
        ),
      },
    ],
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const handleButtonVaribles = (e, value) => {
    e.preventDefault();
    setMessage(message + value);
  };

  const handleUploadClick = (e) => {
    e.preventDefault();
    document.querySelector('.file-upload').click();
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      setFile(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // online users
  //  const handleShowMorePosts = () => {
  //    // setNextPage(1 + nextPage) // Get the next page count
  //    const payload = {
  //      page: nextPage,
  //      pageSize: 8,
  //      token: token,
  //      online: true,
  //    };
  //    if (nextPage !== null) {
  //      setLoading(true); // Show loading spinner
  //    }
  //    dispatch(customerListAction(payload))
  //      .then(unwrapResult)
  //      .then((result) => {
  //        result = result.data;
  //        const newResults = result.data;
  //        setNextPage(result.nextPage);
  //        setListData((prevListData) => ({
  //          data: [...prevListData.data, ...newResults],
  //          nextPage: result.nextPage,
  //        }));
  //        setPageCount(newResults.nextPage);
  //        setLoading(false); // Hide loading spinner
  //      })
  //      .catch((error) => {
  //        setLoading(false); // Hide loading spinner
  //      });
  //  };

  return (
    <div className={`${style.homeUserNewform} ${style.filterForm}`}>
      <form>
        <div className={style.fromGroup}>
          <label>Online</label>
          <input
            type='checkbox'
            id='online'
            name='online'
            onClick={() => {
              setOnline(!online);
            }}
          />
          <label for='online'>Yes</label>
        </div>
        <div className={style.fromGroup}>
          <label>New</label>
          <input
            type='checkbox'
            id='verified_no'
            name='verified_no'
            onClick={() => {
              setNewUser(!newUser);
            }}
          />
          <label for='verified_no'>Yes</label>
        </div>
        <div className={style.fromGroup}>
          <label>FSK</label>
          <input
            type='checkbox'
            id='fsk'
            name='fsk'
            onClick={() => {
              setFsk(!fsk);
            }}
          />
          <label for='fsk'>Yes</label>
        </div>

        {/* <div className={style.fromGroup}>
          <div className={style.textMessages}>
            <textarea placeholder='' value={message} onChange={(e) => setMessage(e.target.value)} />
            <div>
              <button
                className={style.greenBtn}
                onClick={(e) => handleButtonVaribles(e, ' %username% ')}
              >
                Customer Username
              </button>
              <button
                className={style.greenBtn}
                onClick={(e) => handleButtonVaribles(e, ' %userage% ')}
              >
                Customer Age
              </button>
              <button
                className={style.greenBtn}
                onClick={(e) => handleButtonVaribles(e, ' %usercity% ')}
              >
                Customer City
              </button>
            </div>
          </div>
        </div>
        <div className={style.fromGroup}>
          <div className={style.submitGreenBtn}>
            <button className={style.greenBtn}>Send</button>
          </div>
        </div> */}

        {/* <div className={style.grid}>
          <div className={style.gridItem}>
            <Stack direction='row' spacing={1}>
              <Switch
                checked={showwomen}
                onChange={() => {
                  setShowwomen(!showwomen);
                  setShowmen(false); // Close "Show Men" option
                }}
              />
              <p style={{ paddingTop: '10px' }}>Show Women</p>
            </Stack>
          </div>
          <div className={style.gridItem}>
            <FormControl fullWidth>
              <TextField
                id='outlined-basic'
                label='Username'
                variant='outlined'
                value={username}
                onChange={handleInputChange} // update this line
                className={ClassNames.textField}
              />
            </FormControl>
          </div>
          <div className={style.gridItem}>
            <FormControl fullWidth>
              <TextField
                id='outlined-basic'
                label='Postal Code'
                variant='outlined'
                className={ClassNames.textField}
                value={postalcode}
                onChange={(e) => setPostalcode(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LocationOnIcon style={{ color: 'black' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </div>
          <div className={style.gridItem}>

            <Stack direction='row' spacing={1}>
              <Switch
                checked={showmen}
                onChange={() => {
                  setShowmen(!showmen);
                  setShowwomen(false); // Close "Show Women" option
                }}
              />
              <p style={{ paddingTop: '10px' }}>Show Men</p>
            </Stack>
          </div>
          <div className={style.gridItem}>
            <div className={style.slider}>
              <Typography id='range-slider' gutterBottom>
                Old
              </Typography>
              <Slider
                value={age}
                min={18}
                max={65}
                onChange={(e, value) => setAge(value)}
                valueLabelDisplay='auto'
                aria-labelledby='range-slider'
                getAriaValueText={() => age}
                defaultValue={18}
              />
            </div>
          </div>
          <div className={style.gridItem}>
            <div className={`${style.selectInput} ${style.selectTime}`}>
              <label>Time</label>
              <select value={time} onChange={(e) => setTime(e.target.value)}>
                <option value='1'>1 Min</option>
                <option value='2'>2 Min</option>
                <option value='5'>5 Min</option>
                <option value='10'>10 Min</option>
                <option value='15'>15 Min</option>
                <option value='30'>30 Min</option>
                <option value='60'>60 Min</option>
              </select>
            </div>
          </div>
        </div> */}

        {/* <div className={style.textMessages}>
          <textarea placeholder='' value={message} onChange={(e) => setMessage(e.target.value)} />
          <div>
            <button
              className={style.greenBtn}
              onClick={(e) => handleButtonVaribles(e, ' %username% ')}
            >
              Customer Username
            </button>
            <button
              className={style.greenBtn}
              onClick={(e) => handleButtonVaribles(e, ' %userage% ')}
            >
              Customer Age
            </button>
            <button
              className={style.greenBtn}
              onClick={(e) => handleButtonVaribles(e, ' %usercity% ')}
            >
              Customer City
            </button>
          </div>
        </div> */}

        {/* <div className={style.submitGreenBtn}>
          <button className={style.greenBtn}>Send</button>
        </div> */}
      </form>

      <form>
        <div className={style.grid}>
          <div className={style.gridItem}>
            <Stack direction='row' spacing={1}>
              <Switch
                checked={showwomen}
                onChange={() => {
                  setShowwomen(!showwomen);
                  setShowmen(false); // Close "Show Men" option
                }}
              />
              <p style={{ paddingTop: '10px' }}>Show Women</p>
            </Stack>
          </div>
          <div className={style.gridItem}>
            <FormControl fullWidth>
              <TextField
                id='outlined-basic'
                label='Username'
                variant='outlined'
                value={username}
                onChange={handleInputChange} // update this line
                className={ClassNames.textField}
              />
            </FormControl>
          </div>
          <div className={style.gridItem}>
            <FormControl fullWidth>
              <TextField
                id='outlined-basic'
                label='Postal Code'
                variant='outlined'
                className={ClassNames.textField}
                value={postalcode}
                onChange={(e) => setPostalcode(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LocationOnIcon style={{ color: 'black' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </div>
          <div className={style.gridItem}>
            <Stack direction='row' spacing={1}>
              <Switch
                checked={showmen}
                onChange={() => {
                  setShowmen(!showmen);
                  setShowwomen(false); // Close "Show Women" option
                }}
              />
              <p style={{ paddingTop: '10px' }}>Show Men</p>
            </Stack>
          </div>
          <div className={style.gridItem}>
            <div className={style.slider} style={{ margin: '0px 10px' }}>
              <Typography
                style={{ color: '#000', textAlign: 'left' }}
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
              <Typography style={{ color: '#000', float: 'left' }} id='range-slider' gutterBottom>
                Distance
              </Typography>
              <Typography
                style={{ color: '#000', textAlign: 'right' }}
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
        </div>
      </form>

      <div className={style.recipients}>
        <div>
          Recipients: {recipients} <GpsFixedIcon />
        </div>
        <div onClick={() => getFakeUsers()}>
          <AccountCircleIcon />
          Fake User: {selectedUser?.name}
        </div>
        <div>
          Multi Message <MessageIcon />
        </div>
      </div>

      {selectedUser?.id?.length > 0 && (
        <>
          <div className={style.mainMessages}>
            <div className={style.messageLeft}>
              <div>
                <h3>Multimessage</h3>
                <p>Sends messages to {recipients} customers from all over the world.</p>
              </div>
            </div>
            <div className={style.messageRight}>
              <div className={style.textMessages}>
                <label htmlFor=''>Send Messages to {recipients} customers all over the World</label>
                <textarea
                  placeholder='Write the text here...'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div>
                <button
                  className={style.greenBtn}
                  onClick={(e) => handleButtonVaribles(e, ' %username% ')}
                >
                  Customer Username
                </button>
                <button
                  className={style.greenBtn}
                  onClick={(e) => handleButtonVaribles(e, ' %userage% ')}
                >
                  Customer Age
                </button>
                <button
                  className={style.greenBtn}
                  onClick={(e) => handleButtonVaribles(e, ' %usercity% ')}
                >
                  Customer City
                </button>
              </div>
              <div className={style.clear}>
                <div className={style.formGroupImage}>
                  {!file ? (
                    <img
                      src={
                        filePreview
                          ? filePreview
                          : 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'
                      }
                      alt='Profile Picture'
                      className={style.profile_pic}
                    />
                  ) : (
                    <img
                      src={`${filePreview}`}
                      alt='Profile Picture'
                      className={style.profile_pic}
                    />
                  )}
                  <input
                    type='file'
                    className='file-upload'
                    accept='image/*'
                    onChange={(e) => {
                      handleAvatarChange(e);
                    }}
                    style={{ display: 'none' }}
                  />
                  <button
                    style={{ width: '100px' }}
                    className={style.greenBtn}
                    onClick={handleUploadClick}
                  >
                    Upload
                  </button>
                </div>
              </div>

              <button
                style={{ background: '#fe6828', color: '#fff', width: '150px' }}
                className={style.greenBtn}
                onClick={sendSpamMessage}
              >
                Send
              </button>
            </div>
            <div className={style.clear}></div>
          </div>
        </>
      )}

      <TableContainer {...getTableProps()} component={Paper} sx={{ marginTop: '50px' }}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell
                    {...column.getHeaderProps()}
                    style={{
                      background: 'aliceblue',
                      color: 'black',
                      fontWeight: '600',
                    }}
                  >
                    {column.render('Header')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <TableCell {...cell.getCellProps()} style={{}}>
                        {cell.render('Cell')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <table {...getTableProps()} width='100%' className={style.tableMainNewsStatic}>
        <thead>
          {headerGroups?.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers?.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  style={{
                    background: 'aliceblue',
                    color: 'black',
                    fontWeight: '600',
                  }}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows?.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells?.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} style={{}}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table> */}
      <div className={style.clear}></div>
    </div>
  );
};

export default MultiMessage;

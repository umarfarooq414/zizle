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
  deleteScheduleMessage,
  getScheduleMessage,
  scheduleMessage,
  getCustomers,
} from '../../../../store/slices/adminAPI/actions';
import { useEffect } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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
  '& .MuiSlider-thumbColorPrimary': {
    textAlign: 'center',
  },
};

const StaticMessage = () => {
  const { token } = useUser();
  // const tokenItem = localStorage.getItem("token");
  // const { token } = tokenItem ? JSON.parse(tokenItem) : {};
  const [showwomen, setShowwomen] = useState(false);
  const [showmen, setShowmen] = useState(false);
  const [username, setUsername] = useState('');
  const [time, setTime] = useState(`1`);
  const [listData, setListData] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [postalcode, setPostalcode] = useState(null);
  const [age, setAge] = useState([18, 65]);
  const [message, setMessage] = useState(``);
  const [scheduleMessages, setScheduleMessages] = useState([]);
  const [online, setOnline] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [distance, setDistance] = useState('');
  const [fsk, setFsk] = useState(false);
  const [ageChanged, setAgeChanged] = useState(false);
  const [recipients, setRecipients] = useState(0);
  const [customerIds, setCustomerIds] = useState([]);

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

  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  const sendStaticMessage = (e) => {
    e.preventDefault();
    dispatch(
      scheduleMessage({
        gender: showmen ? 'male' : 'female',
        nickname: username,
        startAge: age[0]?.toString(),
        endAge: age[1]?.toString(),
        time,
        postalCode: postalcode,
        message: message,
      }),
    )
      .then(unwrapResult)
      .then((result) => {
        if (result) {
          setShowwomen(true);
          setShowmen(false);
          setUsername(``);
          setPostalcode(``);
          setAge(0);
          setTime(0);
          setMessage(``);
          getScheduleMessages();
        }
      });
  };

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
          gender:genderValue,
          nickname: username,
          postalCode: postalcode,
          schedule: true,
          online: online,
          newUser: newUser,
          fsk: fsk,
        };
        // console.log(payload, 'payloadfrom');

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

  const getScheduleMessages = () => {
    dispatch(getScheduleMessage())
      .then(unwrapResult)
      .then((result) => {
        setScheduleMessages(result);
      });
  };

  useEffect(() => {
    if (token) {
      console.log(token, 'tokenn');
      getScheduleMessages();
    }
  }, []);
  const data = useMemo(
    () =>
      scheduleMessages?.map((data) => {
        return {
          id: data.id,
          time: data.time,
          status: 'Active',
          message: data.message,
          filters: (
            <div style={{ whiteSpace: 'pre-line', lineHeight: '20px' }}>
              <strong>Name:</strong> {data.filters.nickname} {'\n'}
              <strong>Gender:</strong> {data.filters.gender} {'\n'}
              <strong>Postal Code:</strong> {data.filters.postalCode} {'\n'}
              <strong>Age:</strong> {data.filters.endAge - data.filters.startAge}
            </div>
          ),
          delete: data.id,
        };
      }),
    [scheduleMessages],
  );

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id', // accessor is the "key" in the data
      },
      {
        Header: 'Time',
        accessor: 'time',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Message',
        accessor: 'message',
      },
      {
        Header: 'Filters',
        accessor: 'filters',
      },
      {
        Header: 'Actions',
        accessor: 'delete',
        Cell: ({ cell }) => (
          <button value={cell.row.values.name} onClick={() => deleteMessage(cell.value)}>
            Delete
          </button>
        ),
      },
    ],
    [],
  );

  function deleteMessage(id) {
    dispatch(deleteScheduleMessage(id))
      .then(unwrapResult)
      .then((result) => {
        if (result) {
          getScheduleMessages();
        }
      });
  }

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const handleButtonVaribles = (e, value) => {
    e.preventDefault();
    setMessage(message + value);
  };

  return (
    <div className={style.homeUserNewform}>
      <form
        className={style.filterForm}
        // onSubmit={(e) => {
        //   console.log('hashdgahjsgfdjuasyfgdjyafgdjasjdas')
        //   e.preventDefault()
        //   sendStaticMessage(e);
        // }}
      >
        {/* -------------------------------------------------------------------- */}
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
        <div className={`${style.selectInput} ${style.selectTime} ${style.fromGroup} `}>
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
                  textAlign='center'
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
          <div className={style.fromGroupHead}>
            <div className={style.fromGroup1}>
              <div className={style.textMessages}>
                <textarea
                  placeholder='Write your text here…'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
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
                <button
                  className={style.greenBtn}
                  onClick={(e) => {
                    sendStaticMessage(e);
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </form>
        {/* -------------------------------------------------------------------- */}

        {/* <div className={style.fromGroup}>
          <label>Campaign</label>
          <select>
            <option value=''>Without</option>
            <option value=''>19971</option>
            <option value=''>19972</option>
          </select>
        </div>
        <div className={style.fromGroup}>
          <label>Gender</label>
          <select>
            <option value=''>All </option>
            <option value=''>Male</option>
            <option value=''>Female</option>
          </select>
        </div>
        <div className={style.fromGroup}>
          <label>Country</label>
          <select>
            <option value=''>All Countries</option>
            <option value=''>Canada</option>
            <option value=''>France</option>
            <option value=''>Germany</option>
            <option value=''>Lithuania</option>
            <option value=''>Nigeria</option>
          </select>
        </div>
        <div className={style.fromGroup}>
          <label>Old</label>
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
        <div className={style.fromGroup}>
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
        <div className={style.fromGroup}>
          <label>Verified</label>
          <input type='checkbox' id='verified_no' name='verified_no' />
          <label for='verified_no'>No</label>
        </div>
        <div className={style.fromGroup}>
          <label>Picture</label>
          <input type='checkbox' id='picture' name='picture' />
          <label for='picture'>picture</label>
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

      <TableContainer component={Paper} {...getTableProps()} sx={{ marginTop: '50px' }}>
        <Table sx={{ minWidth: '100%' }} aria-label='simple table'>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
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

export default StaticMessage;

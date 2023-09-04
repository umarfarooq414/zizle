import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import styled from './style.module.css';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/fontawesome-free-solid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import ActionIcon from '../../../../../assets/images/settings.png';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllActionTypesAction,
  updateActionTypeCostAction,
} from '../../../../../store/slices/adminAPI/actions';
import { useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import CloseIcon from '../../../../../assets/images/navClose.png';
import { style } from '@mui/system';

const mainHeading = {
  marginBottom: '10px',
};

const CoinManagement = () => {
  const isMobile = useMediaQuery('(max-width: 786px)');

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? 350 : 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [actionTypeCost, setActionTypeCost] = useState({});
  const { allActionTypes } = useSelector((state) => state.adminApi);
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    dispatch(getAllActionTypesAction());
  };
  useEffect(() => {
    dispatch(getAllActionTypesAction());
  }, []);

  const userActionTypeList = allActionTypes?.data?.slice(0, 8);
  return (
    <div>
      <Typography variant='h6' sx={mainHeading}>
        Dashboard {'>'} Coin Management
      </Typography>
      <p>Enter cost in negative for those actions, for which user coins should be deducted!</p>
      <TableContainer component={Paper} className={styled.coinTable}>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Coins / Message</TableCell>
              <TableCell>Coins / email verification</TableCell>
              <TableCell>Coins / upload avatar</TableCell>
              <TableCell>Coins / profile verified</TableCell>
              <TableCell>Coins / add phone number</TableCell>
              <TableCell>Coins / Account Creation</TableCell>
              <TableCell>Coins / blur picture view</TableCell>
              <TableCell>Coins / Sending Emoji</TableCell>
              {/* <TableCell>coins/ view profile visitor</TableCell> */}
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {userActionTypeList?.map((userActionType) => (
                <TableCell style={{ textAlign: "center" }}>{userActionType?.cost.toString().replace('-', '')}</TableCell>
              ))}
              <TableCell>
                <Button
                  onClick={handleOpen}
                  sx={{
                    minWidth: 'auto',
                    float: 'left',
                    width: '50%',
                  }}
                >
                  {/* <FontAwesomeIcon icon={faEye} /> */}
                  <img
                    style={{
                      height: '20px',
                      width: '20px',
                      filter:
                        'invert(33%) sepia(96%) saturate(1029%) hue-rotate(183deg) brightness(96%) contrast(89%)',
                    }}
                    src={ActionIcon}
                  />
                </Button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby='modal-modal-title'
                  aria-describedby='modal-modal-description'
                >
                  <Box sx={style}>
                    <Button onClick={handleClose} className={styled.closeBtnModal}>
                      <img src={CloseIcon} alt='cross icon' />
                    </Button>
                    <Typography id='modal-modal-title' variant='h6' component='h2'>
                      Update Coins Rates
                    </Typography>
                    <form>
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: '100%',
                          marginTop: '30px',
                          marginBottom: '10px',
                        }}
                      >
                        <TextField
                          inputProps={{ inputMode: 'numeric', pattern: '[0-99]*' }}
                          fullWidth
                          label='No. of Coin per Message'
                          id='1'
                          value={actionTypeCost['1'] || ''}
                          onChange={(event) => {
                            const { id, value } = event.target;
                            setActionTypeCost((prevState) => {
                              const newState = { ...prevState };
                              if (value !== '') {
                                newState[id] = value;
                              } else {
                                delete newState[id];
                              }
                              return newState;
                            });
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: '100%',
                          marginBottom: '10px',
                        }}
                      >
                        <TextField
                          fullWidth
                          inputProps={{ inputMode: 'numeric', pattern: '[0-99]*' }}
                          label='No. of coins per email verification'
                          id='2'
                          value={actionTypeCost['2'] || ''}
                          onChange={(event) => {
                            const { id, value } = event.target;
                            setActionTypeCost((prevState) => {
                              const newState = { ...prevState };
                              if (value !== '') {
                                newState[id] = value;
                              } else {
                                delete newState[id];
                              }
                              return newState;
                            });
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: '100%',
                          marginBottom: '10px',
                        }}
                      >
                        <TextField
                          fullWidth
                          inputProps={{ inputMode: 'numeric', pattern: '[0-99]*' }}
                          label='No. of coins per upload avatar'
                          id='3'
                          value={actionTypeCost['3'] || ''}
                          onChange={(event) => {
                            const { id, value } = event.target;
                            setActionTypeCost((prevState) => {
                              const newState = { ...prevState };
                              if (value !== '') {
                                newState[id] = value;
                              } else {
                                delete newState[id];
                              }
                              return newState;
                            });
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: '100%',
                          marginBottom: '10px',
                        }}
                      >
                        <TextField
                          fullWidth
                          inputProps={{ inputMode: 'numeric', pattern: '[0-99]*' }}
                          label='No. of coins per profile verified'
                          id='4'
                          value={actionTypeCost['4'] || ''}
                          onChange={(event) => {
                            const { id, value } = event.target;
                            setActionTypeCost((prevState) => {
                              const newState = { ...prevState };
                              if (value !== '') {
                                newState[id] = value;
                              } else {
                                delete newState[id];
                              }
                              return newState;
                            });
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: '100%',
                          marginBottom: '10px',
                        }}
                      >
                        <TextField
                          fullWidth
                          inputProps={{ inputMode: 'numeric', pattern: '[0-99]*' }}
                          label='No. of coins per add phone number'
                          id='5'
                          value={actionTypeCost['5'] || ''}
                          onChange={(event) => {
                            const { id, value } = event.target;
                            setActionTypeCost((prevState) => {
                              const newState = { ...prevState };
                              if (value !== '') {
                                newState[id] = value;
                              } else {
                                delete newState[id];
                              }
                              return newState;
                            });
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: '100%',
                          marginBottom: '10px',
                        }}
                      >
                        <TextField
                          fullWidth
                          inputProps={{ inputMode: 'numeric', pattern: '[0-99]*' }}
                          label='No. of coins per Account Creation'
                          id='6'
                          value={actionTypeCost['6'] || ''}
                          onChange={(event) => {
                            const { id, value } = event.target;
                            setActionTypeCost((prevState) => {
                              const newState = { ...prevState };
                              if (value !== '') {
                                newState[id] = value;
                              } else {
                                delete newState[id];
                              }
                              return newState;
                            });
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: '100%',
                          marginBottom: '10px',
                        }}
                      >
                        <TextField
                          fullWidth
                          inputProps={{ inputMode: 'numeric', pattern: '[0-99]*' }}
                          label='No. of coins per blur picture view'
                          id='7'
                          value={actionTypeCost['7'] || ''}
                          onChange={(event) => {
                            const { id, value } = event.target;
                            setActionTypeCost((prevState) => {
                              const newState = { ...prevState };
                              if (value !== '') {
                                newState[id] = value;
                              } else {
                                delete newState[id];
                              }
                              return newState;
                            });
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: '100%',
                          marginBottom: '10px',
                        }}
                      >
                        <TextField
                          fullWidth
                          inputProps={{ inputMode: 'numeric', pattern: '[0-99]*' }}
                          label='No. of coins per sending Emoji'
                          id='8'
                          value={actionTypeCost['8'] || ''}
                          onChange={(event) => {
                            const { id, value } = event.target;
                            setActionTypeCost((prevState) => {
                              const newState = { ...prevState };
                              if (value !== '') {
                                newState[id] = value;
                              } else {
                                delete newState[id];
                              }
                              return newState;
                            });
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: '100%',
                        }}
                      >
                        <Button
                          variant='contained'
                          onClick={() => {
                            const payload = {
                              actionTypeCosts: Object.keys(actionTypeCost).map((id) => ({
                                id: id.toString(),
                                cost: parseInt(actionTypeCost[id], 10),
                              })),
                            };
                            const formattedPayload = {
                              actionTypeCosts: [...payload.actionTypeCosts],
                            };
                            dispatch(updateActionTypeCostAction(formattedPayload));
                          }}
                        >
                          Submit
                        </Button>
                      </Box>
                    </form>
                  </Box>
                </Modal>

                {/* <Button
                  sx={{
                    minWidth: 'auto',
                    float: 'left',
                    width: '50%',
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button> */}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CoinManagement;

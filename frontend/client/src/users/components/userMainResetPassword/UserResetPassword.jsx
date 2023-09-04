/* eslint-disable no-undef */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoMain from '../../../assets/images/logo_main.png';
import { resetPasswordAction } from './../../../store/slices/userAuth/actions';
import styled from './style.module.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: '10px',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const UserResetPassword = () => {
  const [error, setError] = useState('');
  const { successMessage } = useSelector((state) => state.userAuth);
  const [newPassword, setNewPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  let navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const firstHandleClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();

  const location = useLocation();

  useEffect(() => {
    if (successMessage === null) return;
    resetRegisterForm();
  }, [successMessage]);

  useEffect(() => {
    // extract the token from the URL parameter
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    setResetToken(token);
  }, [location.search]);

  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value);

  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPasswordAction({ newPassword: newPassword.toString(), token: resetToken }));
    // setOpen(false)
    if (newPassword !== '') {
      navigate('/login');
    }
    if (newPassword === '') {
      setError('Password field cannot be empty');
    } else {
      setError('');
    }


  };

  return (
    <>
      {/* {isDropdownShown && ( */}
      <div className={styled.loginScreen}>
        <div className={styled.wrapwidth}></div>
      </div>
      {/* )} */}
      <div className={styled.homeMainRegister}>
        <div className={styled.wrapwidth}>
          <div className={styled.homeMainRegl}>

          </div>

          <div className={styled.homeMainRegr}>
            <div>
              <Modal
                open={open}
                onClose={firstHandleClose}
                aria-labelledby='parent-modal-title'
                aria-describedby='parent-modal-description'
              >
                <Box sx={{ ...style, width: 400 }}>
                  <React.Fragment>
                    <Modal
                      open={open}
                      // onClose={secondHandleClose}
                      aria-labelledby='child-modal-title'
                      aria-describedby='child-modal-description'
                    >
                      <Box sx={{ ...style, width: 400 }}>
                        <Link to={'/'}>
                          <Button
                            className={styled.closeBtnModal}
                            sx={{
                              position: 'absolute',
                              right: '5px',
                              top: '5px',
                              backgroundColor: '#000',
                              color: '#fff',
                              '&:hover': {
                                backgroundColor: '#000',
                                color: '#fff',
                              },
                              width: '15px',
                              height: '15px',
                              borderRadius: '50%',
                              padding: '15px',
                              margin: '0',
                              minWidth: 'auto',
                              fontSize: '12px',
                            }}
                          >
                            x
                          </Button>
                        </Link>
                        <h2 id='parent-modal-title' style={{ textAlign: 'center' }}>
                          Enter new password
                        </h2>
                        <p id='parent-modal-description' style={{ textAlign: 'center' }}>
                          You can reset your password here.
                        </p>
                        <form onSubmit={handleSubmit}>
                          <div className={styled.formGroup}>
                            <p id='parent-modal-description' style={{ textAlign: 'Left' }}>
                              Enter new Password.
                            </p>
                            <input
                              type='password'
                              placeholder='New Password'
                              value={newPassword}
                              onChange={handlePasswordChange}
                            />
                            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                          </div>
                          <div className={styled.formGroup}>
                            <button>Submit</button>
                          </div>
                        </form>
                      </Box>
                    </Modal>
                  </React.Fragment>
                </Box>
              </Modal>
            </div>
          </div>
          <div className={styled.clear}></div>
        </div>
      </div>
    </>
  );
};

export default UserResetPassword;

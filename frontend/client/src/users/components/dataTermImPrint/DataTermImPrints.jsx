import React, { useEffect, useState, useContext } from 'react';
import styled from './style.module.css';
import { Link, useNavigate } from 'react-router-dom';
import ProfilePic from '../../../assets/images/logo_main.png';
import LogoMain from '../../../assets/images/logo_main.png';
import MenuIcon from '../../../assets/images/navMenu.png';
import MenuClose from '../../../assets/images/navClose.png';

import { useDispatch, useSelector } from 'react-redux';
import {
  forgetPasswordAction,
  resigterUserAction,
  userLoginAction,
  resigteroauthUserAction,
} from '../../../store/slices/userAuth/actions';
import { unwrapResult } from '@reduxjs/toolkit';
import { GoogleLogin } from '@leecheuk/react-google-login';
import { gapi } from 'gapi-script';
import axios from 'axios';
import APIS from '../../../oAuth/config';
import FacebookLogin from 'react-facebook-login';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { googleAndFacebookResp } from '../../../store/slices/socialResponce/actions';
import { useUser } from '../../../providers/useUser';

import GoogleIcon from '../../../assets/images/google_icon.svg';
import FacebookIcon from '../../../assets/images/facebook_icon.svg';
import CloseIcon from '../../../assets/images/navClose.png';
import DarkModeContext, { DarkModeProvider } from '../../../providers/DarkModeContext';
const style = {
  position: 'absolute',
  top: '22%',
  left: '0',
  right: '0',
  height: 'auto',
  maxWidth: 360,
  // background: '0px 0px 10px rgba(0, 0, 0, 0.4)',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.12);',
  pt: 2,
  px: 4,
  py: 4,
  margin: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '0.75rem',
};
const DataTermImPrints = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isMobileVersionVisible, setIsMobileVersionVisible] = useState(false);
  const registrationHandleOpen = () => { };
  const loginHandleOpen = () => { };

  const toggleMobileVersion = () => {
    setIsMobileVersionVisible(!isMobileVersionVisible);
  };

  const { successMessage } = useSelector((state) => state.userAuth);
  const [objResp, setObjResp] = useState('');
  const [selfGender, setSelfGender] = useState('');
  const [interestedGender, setInterestedGender] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginpassword, setLoginPassword] = useState('');
  const [animationClass, setAnimationClass] = useState('');

  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [registerOpen, setRegisterOpen] = React.useState(false);
  const [problemSiningOpen, setProblemSiningOpen] = React.useState(false);
  // const [forgetPasswordEmail, setForgetPasswordEmail] = useState('');
  const { setToken } = useUser();
  const firstHandleOpen = () => {
    setOpen(true);
  };
  const firstHandleClose = () => {
    setOpen(false);
  };
  const secondHandleOpen = () => {
    setOpen1(true);
  };
  const secondHandleClose = () => {
    setOpen1(false);
  };

  const registertHandleOpen = () => {
    setRegisterOpen(true);
  };
  const registertHandleClose = () => {
    setRegisterOpen(false);
  };

  const problemSiningHandleOpen = () => {
    setProblemSiningOpen(true);
  };
  const problemSiningHandleClose = () => {
    setProblemSiningOpen(false);
  };

  const [resetPwdopen, setResetPwdopen] = React.useState(false);
  const resetPwdtHandleOpen = () => setResetPwdopen(true);
  const resetPwdtHandleClose = () => setResetPwdopen(false);

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const resetRegisterForm = () => {
    setSelfGender('');
    setInterestedGender('');
    setUserName('');
    setEmail('');
    setPassword('');
  };

  //TODO ADD ZIZLE ACCOUNTS

  const googleclientID =
    process.env.REACT_PUBLIC_GOOGLE_CLIENT_ID ||
    '343647246365-bkvbki1pdflf62hk0562ti99cbi7q2d0.apps.googleusercontent.com';
  const facboookclientID = process.env.REACT_PUBLIC_FACEBOOK_CLIENT_ID || '243123391546516';
  // '243520874859699';

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // if (user !== null) {
    //   navigate('/userHome');
    // } else {
    //   navigate('/login');
    // }
  }, []);

  useEffect(() => {
    if (successMessage === null) return;
    resetRegisterForm();
  }, [successMessage]);

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: process.env.REACT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: 'email',
      });
    }
    gapi.load('client:auth2', start);
  });

  const loginSubmitHandler = (event) => {
    if (loginEmail.length === 0) {
      return 0;
    }
    event.preventDefault();
    const payload = {
      email: loginEmail,
      password: loginpassword,
    };

    dispatch(userLoginAction(payload))
      .then(unwrapResult)
      .then((result) => {
        setToken(result.access_token);
        localStorage.setItem('user', JSON.stringify(result.user));
        if (result.user.role === 'CUSTOMER') {
          navigate('/userHome', { state: { token: result.access_token } });
        }
      })
      .catch((error) => {
        localStorage.setItem('userCatchEamil', payload.email);
        localStorage.setItem('userCatchStatusCode', error?.response?.statusCode);
        localStorage.setItem('userCatchMessage', error?.response?.message);
        navigate('/', { state: { email: payload?.email } });
      });
  };
  const registerSubmitHandler = (event) => {
    if (loginEmail.length === 0) {
      return 0;
    }
    event.preventDefault();
    const props = {
      email: loginEmail,
      password: loginpassword,
    };
    navigate('/userSocialRegister', {
      state: {
        userProps: props,
      },
    });
  };
  // ************** Google
  const responseGoogle = async (response) => {
    const res = await axios.get(`${APIS.CHECK_EMAILS}/${response.profileObj.email}`);
    var verifyUser = res?.data?.email;
    const payload = { token: response.tokenId, socialProvider: 'google' };
    const payload2 = {
      profile: response?.profileObj,
      token: response.tokenId,
    };
    setObjResp(payload2);
    if (verifyUser) {
      dispatch(resigteroauthUserAction(payload))
        .then(unwrapResult)
        .then((result) => {
          setToken(result?.access_token);
          localStorage.setItem('user', JSON.stringify(result?.user));
          navigate('/userHome');
        })
        .catch((error) => { });
    } else {
      dispatch(googleAndFacebookResp(objResp))
        .then(unwrapResult)
        .then((result) => {
          // formRef.current.reset();
          navigate('/userSocialRegister', {
            state: {
              profile: response?.profileObj,
              token: response.tokenId,
              socialProvider: 'google',
            },
          });
        })
        .catch((error) => { });
    }
  };

  // ************** facebook
  const responseFacebook1 = async (response) => {
    const res = await axios.get(`${APIS.CHECK_EMAILS}/${response.email}`);
    var verifyUser = res?.data?.email;
    const payload = { token: response.accessToken, socialProvider: 'facebook' };
    const payload2 = {
      profile: response,
      token: response.accessToken,
    };
    setObjResp(payload2);
    if (verifyUser) {
      dispatch(resigteroauthUserAction(payload))
        .then(unwrapResult)
        .then((result) => {
          setToken(result?.access_token);
          localStorage.setItem('user', JSON.stringify(result?.user));
          navigate('/userHome');
        })
        .catch((error) => { });
      // navigate('/userHome')
    } else {
      dispatch(googleAndFacebookResp(objResp))
        .then(unwrapResult)
        .then((result) => {
          // formRef.current.reset();
          if (response.status !== 'unknown') {
            navigate('/userSocialRegister', {
              state: {
                profile: response,
                token: response.accessToken,
                socialProvider: 'facebook',
              },
            });
          }
        })
        .catch((error) => { });
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleForgetPassword = (e) => {
    e.preventDefault();
    dispatch(forgetPasswordAction({ email }));
  };

  return (
    <>
      <div className={styled.mainDiv}>
        <div className={`${styled.wrapwidth} ${styled.wrap1}`}>
          <div className={styled.logoMain}>
            <Link to='/'>
              <img src={LogoMain} alt='logo' />
            </Link>
            {/* <Link to=""></Link> */}
          </div>
          <div className={styled.loginMainSec}>
            <div className={styled.mobileVersion} onClick={toggleMobileVersion}>
              {isMobileVersionVisible ? '' : <img src={MenuIcon} alt='loading' />}
            </div>
            <div
              className={
                isMobileVersionVisible ? `${styled.desktopVersion}` : `${styled.mobileHidden}`
              }
            >
              <div className={styled.mobileVersionIn} onClick={toggleMobileVersion}>
                {isMobileVersionVisible ? <img src={MenuClose} alt='loading' /> : ''}
              </div>
              <div>
                <button className={styled.registrationDataIm} onClick={registertHandleOpen}>
                  Registration
                </button>
                <button className={styled.loginDataIm} onClick={firstHandleOpen}>
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styled.homeMainRegister1}>
        <div className={styled.wrapwidth}>
          <div className={styled.homeMainRegr}>
            <div>
              <Modal
                open={open}
                onClose={firstHandleClose}
                aria-labelledby='parent-modal-title'
                aria-describedby='parent-modal-description'
              >
                <Box sx={{ ...style, width: 'auto' }} className={styled.modelBoxReg}>
                  <Button onClick={firstHandleClose} className={styled.closeBtnModal}>
                    <img src={CloseIcon} alt='cross icon' />
                  </Button>
                  <h2 id='parent-modal-title'>Login with email</h2>
                  <ul className={styled.loginSocials}>
                    <li>
                      <GoogleLogin
                        clientId={googleclientID}
                        render={(renderProps) => (
                          <button
                            style={{ border: 0, cursor: 'pointer' }}
                            onClick={() => {
                              renderProps.onClick(); // Call the first function; // Call the second function
                            }}
                          >
                            <img src={GoogleIcon} alt='facebook icon' />
                            <span>
                              <button>MIT GOOGLE ANMELDEN</button>
                            </span>
                          </button>
                        )}
                        buttonText='Login'
                        onSuccess={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                      />
                    </li>
                    <li style={{}}>
                      <img src={FacebookIcon} alt='facebook icon' />
                      <FacebookLogin
                        appId={facboookclientID}
                        autoLoad={false}
                        callback={responseFacebook1}
                        onFail={(error) => {}}
                        fields='name,email,picture'
                        scope='public_profile,email'
                        textButton='MIT FACEBOOK ANMELDEN'
                        // render={({ onClick }) => (
                        //   <button style={{ border: 0, cursor: 'pointer' }} onClick={onClick}>
                        //     <h3>MIT FACEBOOK ANMELDEN</h3>
                        //   </button>
                        // )}
                        style={{ border: 'none', backgroundColor: 'none' }}
                      />
                    </li>
                  </ul>
                  <p
                    id='parent-modal-description'
                    style={{
                      textAlign: 'center',
                      color: 'rgba(0,0,0,.7)',
                      fontSize: '14px',
                      lineHeight: '20px',
                      margin: '0px 0px 10px;',
                    }}
                  >
                    or
                  </p>

                  <form
                    onSubmit={(e) => {
                      loginSubmitHandler(e);
                    }}
                    className={styled.formLogin}
                  >
                    <div className={styled.formGroup}>
                      <input
                        type='text'
                        placeholder='Email'
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                      <br />
                      <br />
                    </div>
                    <div className={styled.formGroup}>
                      <input
                        type='password'
                        placeholder='Password'
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>
                    <div className={styled.formGroup}>
                      <button>Submit</button>
                    </div>
                    <div className={styled.clear}></div>
                  </form>

                  <React.Fragment>
                    <Button
                      onClick={secondHandleOpen}
                      style={{
                        textAlign: 'center',
                        margin: '15px auto 0',
                        display: 'block',
                        fontSize: '12px',
                        color: '#dc2626',
                        lineHeight: '16px',
                        textDecoration: 'underline',
                        textTransform: 'lowercase',
                        backgroundColor: 'none',
                        background: 'none',
                      }}
                    >
                      Forgot your password?
                    </Button>
                    <Modal
                      open={open1}
                      onClose={secondHandleClose}
                      aria-labelledby='child-modal-title'
                      aria-describedby='child-modal-description'
                    >
                      <Box sx={{ ...style, width: 400 }}>
                        <Button onClick={secondHandleClose} className={styled.closeBtnModal}>
                          <img src={CloseIcon} alt='cross icon' />
                        </Button>
                        <h2
                          id='parent-modal-title'
                          style={{ textAlign: 'center', margin: '5px 0px 8px', fontSize: '24px' }}
                        >
                          Reset Password
                        </h2>
                        <p
                          id='parent-modal-description'
                          style={{
                            textAlign: 'center',
                            maxWidth: '332px',
                            margin: '0px auto 10px',
                          }}
                        >
                          You can reset your password with an email to your email address.
                        </p>
                        <form onClick={handleForgetPassword} className={styled.formLogin}>
                          <div className={isDarkMode ? styled.formGroupDark : styled.formGroup}>
                            <input
                              type='email'
                              placeholder='E-Mail Address'
                              value={email}
                              onChange={handleEmailChange}
                            />
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

              <Modal
                open={registerOpen}
                onClose={registertHandleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
              >
                <Box sx={style} className={styled.modelBoxReg}>
                  <Button onClick={registertHandleClose} className={styled.closeBtnModal}>
                    <img src={CloseIcon} alt='cross icon' />
                  </Button>
                  <h2 id='parent-modal-title'>Register for free</h2>
                  <p>
                    By clicking on »Register for free«, you agree to the processing and use of your
                    data in accordance with the <Link to='/data-protection'>data protection</Link>{' '}
                    declaration and the <Link to='/term-of-use'>terms of use</Link> . Operator
                    information in the <Link to='/imprint'>imprint</Link> .
                  </p>
                  <ul className={styled.loginSocials}>
                    <li>
                      <GoogleLogin
                        clientId={googleclientID}
                        render={(renderProps) => (
                          <button
                            style={{ border: 0, cursor: 'pointer' }}
                            onClick={() => {
                              renderProps.onClick(); // Call the first function; // Call the second function
                            }}
                          >
                            <img src={GoogleIcon} alt='facebook icon' />
                            <span>
                              <button>MIT GOOGLE ANMELDEN</button>
                            </span>
                          </button>
                        )}
                        buttonText='Login'
                        onSuccess={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                      />
                    </li>
                    <li style={{}}>
                      <img src={FacebookIcon} alt='facebook icon' />
                      <FacebookLogin
                        appId={facboookclientID}
                        autoLoad={false}
                        callback={responseFacebook1}
                        onFail={(error) => {}}
                        fields='name,email,picture'
                        scope='public_profile,email'
                        textButton='MIT FACEBOOK ANMELDEN'
                        // render={({ onClick }) => (
                        //   <button style={{ border: 0, cursor: 'pointer' }} onClick={onClick}>
                        //     <h3>MIT FACEBOOK ANMELDEN</h3>
                        //   </button>
                        // )}
                        style={{ border: 'none', backgroundColor: 'none' }}
                      />
                    </li>
                  </ul>
                  <p
                    id='parent-modal-description'
                    style={{
                      textAlign: 'center',
                      color: 'rgba(0,0,0,.7)',
                      fontSize: '14px',
                      lineHeight: '20px',
                      margin: '0px 0px 10px;',
                    }}
                  >
                    or
                  </p>

                  <form
                    onSubmit={(e) => {
                      registerSubmitHandler(e);
                    }}
                    className={styled.formLogin}
                  >
                    <div className={styled.formGroup}>
                      <input
                        type='text'
                        placeholder='Email'
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                      <br />
                      <br />
                    </div>
                    <div className={styled.formGroup}>
                      <input
                        type='password'
                        placeholder='Password'
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>
                    <div className={styled.formGroup}>
                      <button>Register with Email</button>
                    </div>
                    <div className={styled.clear}></div>
                  </form>
                  <React.Fragment>
                    <Button
                      onClick={problemSiningHandleOpen}
                      style={{
                        textAlign: 'center',
                        margin: '15px auto 0',
                        display: 'block',
                        fontSize: '12px',
                        color: '#dc2626',
                        lineHeight: '16px',
                        textDecoration: 'underline',
                        textTransform: 'lowercase',
                        background: 'none',
                        backgroundColor: 'none',
                      }}
                    >
                      Problems signing in?
                    </Button>
                    <Modal
                      open={problemSiningOpen}
                      onClose={problemSiningHandleClose}
                      aria-labelledby='child-modal-title'
                      aria-describedby='child-modal-description'
                    >
                      <Box sx={{ ...style, width: 400 }} className={styled.modelBoxReg}>
                        <Button onClick={problemSiningHandleClose} className={styled.closeBtnModal}>
                          <img src={CloseIcon} alt='cross icon' />
                        </Button>
                        <h2
                          id='parent-modal-title'
                          style={{ textAlign: 'center', margin: '5px 0px 8px', fontSize: '24px' }}
                        >
                          Contact support
                        </h2>
                        <p
                          id='parent-modal-description'
                          style={{
                            textAlign: 'center',
                            maxWidth: '332px',
                            margin: '0px auto 10px',
                          }}
                        >
                          Your message will be reviewed by our support team and you will be replied
                          to via your email address.
                        </p>
                        <form onClick={handleForgetPassword} className={styled.formLogin}>
                          <div className={isDarkMode ? styled.formGroupDark : styled.formGroup}>
                            <input
                              type='email'
                              placeholder='E-Mail Address'
                              value={email}
                              onChange={handleEmailChange}
                            />
                          </div>
                          <div className={isDarkMode ? styled.formGroupDark : styled.formGroup}>
                            <textarea placeholder='News' onChange={handleEmailChange}></textarea>
                          </div>
                          <div className={styled.formGroup}>
                            <button>Submit</button>
                          </div>
                        </form>
                      </Box>
                    </Modal>
                  </React.Fragment>
                  <hr className={styled.hrLineLast} />
                  <div className={styled.registerLast}>
                    <p>
                      Matching partners in your area <br />
                      Automatically checked profiles <br />
                      Safe and TÜV SÜD certified software
                    </p>
                  </div>
                </Box>
              </Modal>

              <Modal
                open={resetPwdopen}
                onClose={resetPwdtHandleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
              >
                <Box sx={{ ...style, width: 400 }} className={styled.modelBoxReg}>
                  <Button onClick={resetPwdtHandleClose} className={styled.closeBtnModal}>
                    <img src={CloseIcon} alt='cross icon' />
                  </Button>
                  <h2
                    id='parent-modal-title'
                    style={{ textAlign: 'center', margin: '5px 0px 8px', fontSize: '24px' }}
                  >
                    reset Password
                  </h2>
                  <p
                    id='parent-modal-description'
                    style={{
                      textAlign: 'center',
                      maxWidth: '332px',
                      margin: '0px auto 20px',
                    }}
                  >
                    You can reset your password with an email to your email address.
                  </p>
                  <form onClick={handleForgetPassword} className={styled.formLogin}>
                    <div className={styled.formGroup}>
                      <input
                        type='email'
                        placeholder='E-Mail Address'
                        value={email}
                        onChange={handleEmailChange}
                      />
                    </div>

                    <div className={styled.formGroup}>
                      <button>Send</button>
                    </div>
                  </form>
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

export default DataTermImPrints;

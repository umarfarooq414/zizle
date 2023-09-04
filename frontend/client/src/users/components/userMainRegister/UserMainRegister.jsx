/* eslint-disable no-undef */
import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from './style.module.css';
import LogoMain from '../../../assets/images/logo_main.png';

import ForHim from '../../../assets/images/forHim.svg';
import ForHer from '../../../assets/images/forHer.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import DarkModeContext from '../../../providers/DarkModeContext';
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
import { toast } from 'react-toastify';

import GoogleIcon from '../../../assets/images/google_icon.svg';
import FacebookIcon from '../../../assets/images/facebook_icon.svg';
import CloseIcon from '../../../assets/images/navClose.png';

// import { setProfileObj } from '../../../oAuth/porfileObjSlice';
const style = {
  position: 'absolute',
  top: '22%',
  left: '0',
  right: '0',
  height: 'auto',
  maxWidth: 360,
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 1);',

  pt: 2,
  px: 4,
  py: 4,
  margin: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '0.75rem',
};

const UserMainRegister = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  // const [objResp, setObjResp] = useState({ profile: null, tokenId: null });
  const { successMessage } = useSelector((state) => state.userAuth);
  const [objResp, setObjResp] = useState('');
  const [selfGender, setSelfGender] = useState('');
  const [interestedGender, setInterestedGender] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState({ email: '', password: '' });
  const [animationClass, setAnimationClass] = useState('');

  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [registerOpen, setRegisterOpen] = React.useState(false);
  const [problemSiningOpen, setProblemSiningOpen] = React.useState(false);
  const [resetPwdopen, setResetPwdopen] = React.useState(false);

  // const [forgetPasswordEmail, setForgetPasswordEmail] = useState('');
  const { token, setToken, setUser, user } = useUser();

  const [contactSupport, setContactSupport] = React.useState(false);
  const contactSupportHandleOpen = () => {
    setContactSupport(true);
  };
  const contactSupportHandleClose = () => {
    setContactSupport(false);
  };

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
    setDescription('');
  };

  //TODO ADD ZIZLE ACCOUNTS

  const googleclientID =
    process.env.REACT_PUBLIC_GOOGLE_CLIENT_ID ||
    '343647246365-bkvbki1pdflf62hk0562ti99cbi7q2d0.apps.googleusercontent.com';
  const facboookclientID = process.env.REACT_PUBLIC_FACEBOOK_CLIENT_ID || '243123391546516';
  // '243520874859699';

  useEffect(() => {
    if (user !== null) {
      navigate('/userHome');
    } else {
      navigate('/login');
    }
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
    event.preventDefault();

    if (loginEmail.length === 0 || loginPassword.length === 0) {
      toast.error(`Please fill in all the fields`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    const payload = {
      email: loginEmail,
      password: loginPassword,
    };

    dispatch(userLoginAction(payload))
      .then(unwrapResult)
      .then((result) => {
        if (result.user ? result.user.role === 'CUSTOMER' : result.role === 'CUSTOMER') {
          setToken(result.access_token ? result.access_token : null);
          setUser(result.user ? result.user : result);
          localStorage.setItem('token', result.access_token ? result.access_token : null);
          localStorage.setItem('user', JSON.stringify(result.user ? result.user : result));
          navigate('/userHome', {
            state: { token: result.access_token ? result.access_token : null },
          });
        } else {
          toast.error(`Something Went Wrong`, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      })
      .catch((error) => {
        if (error?.response?.statusCode === 401) {
          // A 401 status code usually implies invalid credentials.
          toast.error(error.response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          // Some other error occurred
          toast.error(error.response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }

        localStorage.setItem('userCatchEamil', payload?.email);
        localStorage.setItem('userCatchStatusCode', error?.response?.statusCode);
        localStorage.setItem('userCatchMessage', error?.response?.message);
      });
  };

  const registerSubmitHandler = (event) => {
    event.preventDefault();

    if (loginEmail.length === 0 || loginPassword.length === 0) {
      toast.error(`Please fill in all the fields`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    const props = {
      email: loginEmail,
      password: loginPassword, // corrected variable name here
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
          setUser(result?.user);
          navigate('/userHome');
        })
        .catch((error) => {});
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
        .catch((error) => {});
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
          setUser(result?.user);
          navigate('/userHome');
        })
        .catch((error) => {});
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
        .catch((error) => {});
    }
  };

  const handleEmailChangeDesc = (event) => {
    setDescription(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleForgetPassword = (e) => {
    e.preventDefault();
    if (email.length === 0) {
      toast.error(`Please fill in the email field`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    dispatch(forgetPasswordAction({ email }));
    setEmail('');
    setOpen(false);
  };

  useEffect(() => {
    // Start the animation after component mounts
    setAnimationClass('animated');
  }, []);

  // const registertHandleOpen = (e) => {
  //   e.preventDefault();
  // };

  return (
    <>
      {/* {isDropdownShown && ( */}
      <div className={styled.loginScreen}>
        <div className={`${styled.wrapwidth1} ${styled.wrap1}`}>
          <div className={styled.logoMain}>
            <Link to='/'>
              <img src={LogoMain} alt='logo' />
            </Link>
            {/* <Link to=""></Link> */}
          </div>
          <div className={styled.loginMainSec}>
            <button onClick={firstHandleOpen}>Login</button>
          </div>
        </div>
        <div className={`${styled.wrapwidth} ${styled.wrap2}`}>
          <div className={`${styled.logoMain} ${styled.mobileVersionHeader}`}>
            <Link to='/'>
              <img src={LogoMain} alt='logo' />
            </Link>
            {/* <Link to=""></Link> */}
          </div>
          <div className={styled.loginContent}>
            {/* <h2 className={`${styled.animated_text} ${styled.animationClass}`}>
              MORE THAN JUST A DATE
            </h2> */}
            <div className={styled.text_animation}>
              <div className={`${styled.animated_text} ${styled.animationClass}`}>
                <span style={{ color: isDarkMode ? '#fff' : '#fff' }}>MORE THAN JUST A DATE</span>
              </div>
            </div>

            <div className={`${styled.loginMainSec} ${styled.mobileVersionHeader}`}>
              <button onClick={firstHandleOpen}>Login</button>
            </div>
            <button onClick={registertHandleOpen} className={styled.headerLoginBtn}>
              Signup Now For Free
            </button>
            {/* <Link to='/' className={styled.headerLoginBtn}>
              signup now for free
            </Link> */}
          </div>
        </div>
      </div>

      <div className={styled.headerbottomNav}>
        <div className={styled.wrapwidth}>
          <div className={styled.footerNav1}>
            <h3>DOCUMENTS</h3>
            <ul>
              <li>
                <Link to='/data-protection'>Data Protection</Link>
              </li>
              <li>
                <Link to='/term-of-use'>Terms of Use</Link>
              </li>
              <li>
                <Link to='/imprint'>Imprint</Link>
              </li>
              <li>
                <button onClick={contactSupportHandleOpen}>Contact</button>
              </li>
            </ul>
          </div>
          <div className={styled.footerNav1}>
            <h3>CONNECTIONS</h3>
            <ul>
              <li>
                <button onClick={firstHandleOpen}>Login</button>
              </li>
              <li>
                <button onClick={registertHandleOpen}>Sign Up Now For Free</button>
              </li>
              <li>
                <button onClick={resetPwdtHandleOpen}>Reset Password</button>
              </li>
            </ul>
          </div>
          <div className={styled.footerNav1}>
            <h3>SOCIAL</h3>
          </div>
          <div className={styled.footerNav1}>
            <h3>APP</h3>
          </div>
          <div className={styled.clear}></div>
        </div>
        <div className={styled.wrapwidth}>
          <div className={styled.footerSec1}>
            <p>
              By clicking on »Register for free«, you agree to the processing and use of your data
              in accordance with the data protection declaration and the terms of use. Operator
              information in the imprint.
            </p>
          </div>
        </div>
        <div className={styled.wrapwidth}>
          <div className={styled.footerSec2}>
            <p>&copy; 2022 Zizle - Made with ❤</p>
          </div>
        </div>
      </div>

      {/* )} */}
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
                <Box
                  sx={{
                    ...style,
                    width: 'auto',
                    backgroundColor: isDarkMode ? '#282424' : null,
                  }}
                  className={styled.modelBoxReg}
                >
                  <Button
                    onClick={firstHandleClose}
                    className={styled.closeBtnModal}
                    style={{ background: 'transparent' }}
                  >
                    <img
                      src={CloseIcon}
                      alt='cross icon'
                      style={{ filter: isDarkMode ? 'invert(100%)' : 'none' }}
                    />
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
                              <button>
                                <span>MIT GOOGLE ANMELDEN</span>
                              </button>
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
                        buttonStyle={{ color: isDarkMode ? '#fff' : null }}
                      />
                    </li>
                  </ul>
                  <p
                    id='parent-modal-description'
                    style={{
                      textAlign: 'center',
                      color: isDarkMode ? '#fff' : '#000',
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
                    <div className={isDarkMode ? styled.formGroupp : styled.formGroup}>
                      <input
                        type='text'
                        placeholder='Email'
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                      {error.email && <p>{error.email}</p>}
                      <br />
                      <br />
                    </div>
                    <div className={isDarkMode ? styled.formGroupp : styled.formGroup}>
                      <input
                        type='password'
                        placeholder='Password'
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                      {error.password && <p>{error.password}</p>}
                    </div>
                    <div className={styled.formGroup}>
                      <button className={styled.formGroupHov}>Submit</button>
                    </div>
                    <div className={styled.clear}></div>
                  </form>

                  <React.Fragment>
                    <Button
                      onClick={secondHandleOpen}
                      className={styled.forgetBtn}
                      style={{
                        textAlign: 'center',
                        margin: '15px auto 0',
                        display: 'block',
                        fontSize: '12px',
                        color: isDarkMode ? '#fff' : '#000',
                        lineHeight: '16px',
                        textDecoration: 'underline',
                        textTransform: 'lowercase',
                        background: 'transparent',
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
                      <Box
                        sx={{ ...style }}
                        className={`${styled.modelBoxReg} ${styled.resetPasswordModel}`}
                      >
                        <Button onClick={secondHandleClose} className={`${styled.closeBtnModal}`}>
                          <img src={CloseIcon} alt='cross icon' />
                        </Button>
                        <h2
                          id='parent-modal-title'
                          style={{
                            textAlign: 'center',
                            margin: '5px 0px 8px',
                            fontSize: '24px',
                          }}
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
                        <form onSubmit={handleForgetPassword} className={styled.formLogin}>
                          <div className={isDarkMode ? styled.formGroupp : styled.formGroup}>
                            <input
                              type='email'
                              placeholder='E-Mail Address'
                              value={email}
                              onChange={handleEmailChange}
                              style={{ color: isDarkMode ? '#fff' : '' }}
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
                <Box
                  sx={{
                    ...style,
                    width: 'auto',
                    backgroundColor: isDarkMode ? '#282424' : null,
                  }}
                  className={styled.modelBoxReg}
                >
                  <Button
                    onClick={registertHandleClose}
                    className={styled.closeBtnModal}
                    style={{ background: 'transparent' }}
                  >
                    <img
                      src={CloseIcon}
                      alt='cross icon'
                      style={{ filter: isDarkMode ? 'invert(100%)' : 'none' }}
                    />
                  </Button>
                  <h2 id='parent-modal-title'>Register for free</h2>
                  <p style={{ color: isDarkMode ? '#fff' : '#000' }}>
                    By clicking on »Register for free«, you agree to the processing and use of your
                    data in accordance with the <Link to='/'>data protection</Link> declaration and
                    the <Link to='/'>terms of use</Link> . Operator information in the{' '}
                    <Link to='/'>imprint</Link> .
                  </p>
                  <ul className={styled.loginSocials}>
                    <li style={{ color: isDarkMode ? 'fff' : '#000' }}>
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
                              <button>
                                <span>MIT GOOGLE ANMELDEN</span>
                              </button>
                            </span>
                          </button>
                        )}
                        buttonText='Login'
                        onSuccess={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                      />
                    </li>
                    <li>
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
                        buttonStyle={{ color: isDarkMode ? '#fff' : null }}
                      />
                    </li>
                  </ul>
                  <p
                    id='parent-modal-description'
                    style={{
                      textAlign: 'center',
                      color: isDarkMode ? '#fff' : '#000',
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
                    <div className={isDarkMode ? styled.formGroupp : styled.formGroup}>
                      <input
                        type='text'
                        placeholder='Email'
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                      <br />
                      <br />
                    </div>
                    <div className={isDarkMode ? styled.formGroupp : styled.formGroup}>
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
                      className={styled.problemBtn}
                      style={{
                        textAlign: 'center',
                        margin: '15px auto 0',
                        display: 'block',
                        fontSize: '12px',
                        color: isDarkMode ? '#fff' : '#000',
                        lineHeight: '16px',
                        textDecoration: 'underline',
                        textTransform: 'lowercase',
                        background: 'transparent',
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
                          style={{
                            textAlign: 'center',
                            margin: '5px 0px 8px',
                            fontSize: '24px',
                          }}
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
                        <form onSubmit={handleForgetPassword} className={styled.formLogin}>
                          <div className={isDarkMode ? styled.formGroupp : styled.formGroup}>
                            <input
                              type='email'
                              placeholder='E-Mail Address'
                              value={email}
                              onChange={handleEmailChange}
                            />
                          </div>
                          <div className={isDarkMode ? styled.formGroupp : styled.formGroup}>
                            <textarea
                              placeholder='write your text...'
                              value={description}
                              onChange={handleEmailChangeDesc}
                            ></textarea>
                            {/* <textarea placeholder='News' ></textarea> */}
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
                    <p style={{ color: isDarkMode ? '#fff' : '#000' }}>
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
                <Box
                  sx={{ ...style }}
                  className={`${styled.modelBoxReg} ${styled.resetPasswordModel}`}
                >
                  <Button onClick={resetPwdtHandleClose} className={styled.closeBtnModal}>
                    <img src={CloseIcon} alt='cross icon' />
                  </Button>
                  <h2
                    id='parent-modal-title'
                    style={{
                      textAlign: 'center',
                      margin: '5px 0px 8px',
                      fontSize: '24px',
                    }}
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
                    <div className={isDarkMode ? styled.formGroupp : styled.formGroup}>
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

              <Modal
                open={contactSupport}
                onClose={contactSupportHandleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
              >
                <Box sx={{ ...style }} className={styled.modelBoxReg}>
                  <Button onClick={contactSupportHandleClose} className={styled.closeBtnModal}>
                    <img src={CloseIcon} alt='cross icon' />
                  </Button>
                  <h2
                    id='parent-modal-title'
                    style={{
                      textAlign: 'center',
                      margin: '5px 0px 8px',
                      fontSize: '24px',
                    }}
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
                    Your message will be reviewed by our support team and you will be replied to via
                    your email address.
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
                      <textarea placeholder='News' onChange={handleEmailChange}></textarea>
                    </div>
                    <div className={styled.formGroup}>
                      <button>Submit</button>
                    </div>
                  </form>
                </Box>
              </Modal>

              <Modal
                open={contactSupport}
                onClose={contactSupportHandleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
              >
                <Box sx={{ ...style }} className={styled.modelBoxReg}>
                  <Button onClick={contactSupportHandleClose} className={styled.closeBtnModal}>
                    <img src={CloseIcon} alt='cross icon' />
                  </Button>
                  <h2
                    id='parent-modal-title'
                    style={{
                      textAlign: 'center',
                      margin: '5px 0px 8px',
                      fontSize: '24px',
                    }}
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
                    Your message will be reviewed by our support team and you will be replied to via
                    your email address.
                  </p>
                  <form className={styled.formLogin}>
                    <div className={isDarkMode ? styled.formGroupp : styled.formGroup}>
                      <input type='email' placeholder='E-Mail Address' value={email} />
                    </div>
                    <div className={isDarkMode ? styled.formGroupp : styled.formGroup}>
                      <textarea placeholder='News'></textarea>
                    </div>
                    <div className={styled.formGroup}>
                      <button>Submit</button>
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

export default UserMainRegister;

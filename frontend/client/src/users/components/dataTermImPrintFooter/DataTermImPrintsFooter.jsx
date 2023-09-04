import React, { useState, useContext } from 'react';
import styled from './style.module.css';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

import GoogleIcon from '../../../assets/images/google_icon.svg';
import FacebookIcon from '../../../assets/images/facebook_icon.svg';
import CloseIcon from '../../../assets/images/navClose.png';
import DarkModeContext from '../../../providers/DarkModeContext';

// import { setProfileObj } from '../../../oAuth/porfileObjSlice';
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
  // background: '#fff',
  bgcolor: 'background.paper',
  borderRadius: '0.75rem',
};

const DataTermImPrintsFooter = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [objResp, setObjResp] = useState('');
  const [selfGender, setSelfGender] = useState('');
  const [interestedGender, setInterestedGender] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginpassword, setLoginPassword] = useState('');
  const [animationClass, setAnimationClass] = useState('');

  const [contactSupport, setContactSupport] = React.useState(false);
  const contactSupportHandleOpen = () => {
    setContactSupport(true);
  };
  const contactSupportHandleClose = () => {
    setContactSupport(false);
  };
  return (
    <>
      <div className={styled.headerbottomNav}>
        <div className={styled.wrapwidth}>
          <div className={styled.footerNav1}>
            <h3>LEGAL</h3>
            <ul>
              <li>
                <Link to='/data-protection'>Data protection</Link>
              </li>
              <li>
                <Link to='/term-of-use'>Terms of Use</Link>
              </li>
              <li>
                <Link to='/imprint'>Imprint</Link>
              </li>
            </ul>
          </div>
          <div className={styled.footerNav1}>
            <h3>SOCIAL</h3>
            <ul></ul>
          </div>
          <div className={styled.footerNav1}>
            <h3></h3>
            <ul>
              <li>
                <Link to='/faqs'>Frequently Asked Questions</Link>
              </li>
              <li>
                <button onClick={contactSupportHandleOpen}>Contact</button>
              </li>
            </ul>
          </div>
          <div className={styled.footerNav1}>
            <h3></h3>
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
      <Modal
        open={contactSupport}
        onClose={contactSupportHandleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={{ ...style }} className={styled.modelBoxReg}>
          <Button onClick={contactSupportHandleClose} className={styled.closeBtnModal} style = {{background: 'transparent'}}>
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
            Your message will be reviewed by our support team and you will be replied to via your
            email address.
          </p>
          <form className={styled.formLogin}>
            <div className={isDarkMode ? styled.formGroupDark : styled.formGroup}>
              <input type='email' placeholder='E-Mail Address' value={email} />
            </div>
            <div className={isDarkMode ? styled.formGroupDark : styled.formGroup}>
              <textarea placeholder='News'></textarea>
            </div>
            <div className={styled.formGroup}>
              <button>Submit</button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default DataTermImPrintsFooter;

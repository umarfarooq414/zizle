import React, { useState, useContext } from 'react';
import styled from './style.module.css';
import DataTermImPrints from '../../components/dataTermImPrint/DataTermImPrints';
import DataTermImPrintsFooter from '../../components/dataTermImPrintFooter/DataTermImPrintsFooter';
import { Link } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '../../../assets/images/navClose.png';
import { useDispatch } from 'react-redux';
import { customerSupport } from '../../../store/slices/customerAPI/action';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import DarkModeContext from '../../../providers/DarkModeContext';
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
  borderRadius: '0.75rem',
};
const FaqLogin = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [messageBody, setMessageBody] = useState('');
  const [email, setEmail] = useState('');
  const [contactSupport, setContactSupport] = React.useState(false);
  const dispatch = useDispatch();
  const contactSupportHandleOpen = () => {
    setContactSupport(true);
  };
  const contactSupportHandleClose = () => {
    setContactSupport(false);
  };
  const handleContactSupport = (e) => {
    e.preventDefault();
    const payload = {
      email: email,
      message: messageBody,
    };
    dispatch(customerSupport(payload))
      .then(unwrapResult)
      .then((result) => {
        if (result) {
          setEmail(``);
          setMessageBody(``);
          toast.success('Thank You For your query, We will contact your shortly', {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
  };
  return (
    <>
      <DataTermImPrints />
      <div className={styled.UserLeftNavigation}>
        <div className={styled.UserLeftNavigation}>
          <div className={styled.rightFQA}>
            <h3>frequently asked Questions</h3>
            <p>
              You can find what you are wondering here. If you have additional questions, please
              {/* <Link to='/contact-support' style={{ color: 'purple' }}> */}{' '}
              <button style={{ color: 'purple' }} onClick={contactSupportHandleOpen}>
                Contact support
              </button>
              {/* </Link> */}.
            </p>
            {/* <CustomizedAccordions /> */}
          </div>
        </div>
      </div>
      <Modal
        open={contactSupport}
        onClose={contactSupportHandleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={{ ...style }}
          className={styled.modelBoxReg}
          style={{ background: isDarkMode ? '#121212' : '#fff' }}
        >
          <Button onClick={contactSupportHandleClose} className={styled.closeBtnModal}>
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
          <form className={styled.formLogin} onSubmit={(e) => handleContactSupport(e)}>
            <div className={isDarkMode ? styled.formGroupDark : styled.formGroup}>
              <input
                type='email'
                placeholder='E-Mail Address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={isDarkMode ? styled.formGroupDark : styled.formGroup}>
              <textarea
                placeholder='News'
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
              ></textarea>
            </div>
            <div className={styled.formGroup}>
              <button>Submit</button>
            </div>
          </form>
        </Box>
      </Modal>
      <DataTermImPrintsFooter />
    </>
  );
};

export default FaqLogin;

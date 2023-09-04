import React, { useContext } from 'react';
// import { Modal, ModalVariant, Button } from "@patternfly/react-core";
import { Button, Modal } from '@mui/material';
import { useGlobalModalContext } from './GlobalModal';
// import './style.module.css';
import styled from './style.module.css';
import Box from '@mui/material/Box';
import CloseIcon from '../assets/images/navClose.png';
import treasure from '../assets/images/treasure2.png';
import { useNavigate } from 'react-router-dom';
import DarkModeContext, { useDarkMode } from '../providers/DarkModeContext';
const style = {
  position: 'absolute',
  top: '22%',
  left: '0',
  right: '0',
  height: 'auto',
  maxWidth: window.innerWidth <= 768 ? '250px' : '360px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.12);',
  pt: 2,
  px: 4,
  py: 4,
  margin: 'auto',
  // background: '#fff',
  bgcolor: 'background.paper',
  borderRadius: '0.75rem',
  zIndex: '99999',
};
export const TransactionFailedModal = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const { transactionFailedMessage } = useGlobalModalContext();
  const { hideModal } = useGlobalModalContext();
  const navigate = useNavigate();

  const handleModalToggle = () => {
    hideModal();
  };

  // const [open, setOpen] = React.useState(false);

  const firstHandleClose = () => {
    hideModal();
    navigate('/subscription');
  };
  return (
    // <Modal
    //     // variant={ModalVariant.medium}
    //     title="Update Modal"
    //     isOpen={true}
    //     onClose={handleModalToggle}
    //     style={{ zIndex: 9999 }}

    // >
    <Box
      // style={{ backgroundColor: 'background.paper' }}
      sx={{ ...style, width: '100%', textAlign: 'center', zIndex: '9999' }}
      style={{ backgroundColor: isDarkMode ? '#2d2a2a' : '#fff' }}
    >
      <Button
        className={styled.crossBtnEmp}
        onClick={handleModalToggle}
        sx={{
          // backgroundColor: 'blue',
          border: '1px solid #000',
          borderRadius: '50%',
          height: '20px',
          width: '20px',
          padding: '0',
          float: 'right',
          minWidth: 'auto',
          position: 'absolute',
          right: '10px',
          top: '10px',
          // '&:hover': {
          //     padding: '0',
          //     borderRadius: '5px',
          //     border: '1px solid #ff0000',
          //     filter: "invert(25%) sepia(98%) saturate(7483%) hue-rotate(359deg) brightness(100%) contrast(118%)"
          // },
        }}
      >
        <img
          className='TransCross'
          src={CloseIcon}
          alt='cross icon'
          style={{
            width: '8px',
            textAlign: 'right',
            filter:
              'invert(0%) sepia(8%) saturate(7469%) hue-rotate(300deg) brightness(90%) contrast(110%)',
          }}
        />
      </Button>
      <img
        style={{
          height: '120px',
          display: 'block',
          margin: '10px auto 20px',
        }}
        src={treasure}
        alt='cross icon'
      />
      <h2
        style={{
          textAlign: 'center',
          color: 'rgba(0,0,0,.7)',
          fontSize: '14px',
          lineHeight: '20px',
          margin: '0px 0px 10px;',
        }}
        id='parent-modal-title'
      >
        Fehler!
      </h2>
      <h4
        style={{
          textAlign: 'center',
          color: '#9e9e9e',
          fontSize: '14px',
          lineHeight: '20px',
          margin: '0px 0px 10px;',
        }}
        id='parent-modal-title'
      >
        {transactionFailedMessage}
      </h4>
      <Button
        onClick={firstHandleClose}
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
        Kaufe Münzen
      </Button>
    </Box>
    // </Modal >
  );
};

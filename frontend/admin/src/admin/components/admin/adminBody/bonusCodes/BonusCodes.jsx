import React, { useEffect, useCallback, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/fontawesome-free-solid';
import ActionIcon from '../../../../../assets/images/settings.png';
import Typography from '@mui/material/Typography';
import styled from './style.module.css';
import {
  getBonusCodesAction,
  deleteBonusCodesAction,
  editBonusCodesAction,
} from '../../../../../store/slices/userAuth/actions';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useMediaQuery } from '@mui/material';
import CloseIcon from '../../../../../assets/images/navClose.png';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #ccc',
  boxShadow: 24,
  p: 4,
};
const boxTableIcon = {
  display: 'inline-block',
};
const btnModel = {
  minWidth: '0',
};
const mainHeading = {
  marginBottom: '10px',
};

const BonusCodes = () => {
  const isMobile = useMediaQuery('(max-width: 786px)');
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? 350 : 500,
    bgcolor: 'background.paper',
    border: '1px solid #ccc',
    boxShadow: 24,
    p: 4,
  };
  const [bonusCodes, setBonusCodes] = React.useState();
  const [newBonusCodes, setNewBonusCodes] = React.useState();
  const [bonusCodesCoins, setBonusCodeCoins] = React.useState();
  const [openDeleteId, setOpenDeleteId] = React.useState(null);
  const [openEditId, setOpenEditId] = React.useState(null);
  const [expiryDate, setExpiryDate] = React.useState();
  const handleOpenDelete = (id) => {
    setOpenDeleteId(id);
  };

  const adjustForTimezone = (date) => {
    const timeOffsetInMS = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - timeOffsetInMS);
  };

  const handleOpenEdit = (id) => {
    setOpenEditId(id);
  };
  const handleDeleteBonusCode = async (bonusCode) => {
    try {
      const payload = {
        id: bonusCode?.id,
      };
      dispatch(deleteBonusCodesAction(payload));
      setBonusCodes((prevBonusCodes) => prevBonusCodes.filter((code) => code.id !== bonusCode.id));
      handleCloseDelete();
    } catch (error) {
      console.error('Error deleting bonus code:', error);
    }
  };

  const handleEditBonusCode = async (bonusCode) => {
    try {
      const payload = {
        id: bonusCode?.id,
        expiryDate,
        newBonusCodes,
        bonusCodesCoins,
      };
      dispatch(editBonusCodesAction(payload))
        .then(unwrapResult)
        .then((result) => {
          setBonusCodes((prev) => prev?.map((item) => (item.id === result.id ? result : item)));
        });
      handleCloseEdit();
    } catch (error) {
      console.error('Error deleting bonus code:', error);
    }
  };
  const handleCloseDelete = () => setOpenDeleteId(null);
  const handleCloseEdit = () => setOpenEditId(null);
  const dispatch = useDispatch();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate(),
    ).padStart(2, '0')}`;
  };
  const fetchBonusCodes = useCallback(async () => {
    dispatch(getBonusCodesAction())
      .then(unwrapResult)
      .then((result) => {
        setBonusCodes(result);
      })
      .catch((error) => {
      });
  }, []);

  useEffect(() => {
    fetchBonusCodes();
  }, [fetchBonusCodes]);

  const handleModalClose = () => {
    setOpenEditId(null);
  };

  return (
    <div>
      <Typography variant='h6' sx={mainHeading}>
        Dashboard {'>'} Bonus Code
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='a dense table'>
          <TableHead>
            <TableRow>
              <TableCell>Bonus Code</TableCell>
              <TableCell>Bonus Coin</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          {bonusCodes?.map((bonusCode) => (
            <TableBody key={bonusCode?.id}>
              <TableCell>{bonusCode?.bonusCode}</TableCell>
              <TableCell>{bonusCode?.coins}</TableCell>
              <TableCell>{formatDate(bonusCode?.expiryDate)}</TableCell>
              <TableCell>
                <Box sx={boxTableIcon}>
                  <Button sx={btnModel} onClick={() => handleOpenEdit(bonusCode?.id)}>
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
                    key={`modal-${bonusCode?.id}`}
                    aria-labelledby='transition-modal-title'
                    aria-describedby='transition-modal-description'
                    open={openEditId === bonusCode?.id}
                    onClose={handleCloseEdit}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                      backdrop: {
                        timeout: 500,
                      },
                    }}
                  >
                    <Fade in={openEditId === bonusCode?.id}>
                      <Box sx={style}>
                        <Button onClick={handleModalClose} className={styled.closeBtnModal}>
                          <img src={CloseIcon} alt='cross icon' />
                        </Button>
                        <form>
                          <div className={styled.formGroup}>
                            <label>Bonus Code</label>
                            <input
                              type='text'
                              name='bonus-code'
                              value={bonusCode?.bonusCode}
                              disabled
                            />
                          </div>
                          <div className={styled.formGroup}>
                            <label>Bonus Coin</label>
                            <input
                              type='text'
                              name='bonus-coin'
                              value={bonusCode?.coins}
                              disabled
                            />
                          </div>
                          <div className={styled.formGroup}>
                            <label>Expire date</label>
                            <input
                              type='date'
                              name='bonus-expiry-date'
                              value={adjustForTimezone(new Date(bonusCode?.expiryDate))
                                .toISOString()
                                .slice(0, 10)}
                              onChange={(e) => setExpiryDate(e.target.value)}
                            />
                          </div>
                          <div className={`${styled.fromGroup} ${styled.fromGroupFull}`}>
                            <button type='button' onClick={() => handleEditBonusCode(bonusCode)}>
                              Submit
                            </button>
                          </div>
                        </form>
                      </Box>
                    </Fade>
                  </Modal>
                </Box>
                <Box sx={boxTableIcon}>
                  <Button sx={btnModel} onClick={() => handleOpenDelete(bonusCode?.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  <Modal
                    key={`modal-${bonusCode?.id}`}
                    aria-labelledby='transition-modal-title'
                    aria-describedby='transition-modal-description'
                    open={openDeleteId === bonusCode?.id}
                    onClose={handleCloseDelete}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                      backdrop: {
                        timeout: 500,
                      },
                    }}
                  >
                    <Fade in={openDeleteId === bonusCode?.id}>
                      <Box sx={style}>
                        <Typography>Are you sure to Delete the record?</Typography>
                        <Button onClick={() => handleDeleteBonusCode(bonusCode)}>
                          Confirm Delete
                        </Button>
                        <Button onClick={handleCloseDelete}>Cancel</Button>
                      </Box>
                    </Fade>
                  </Modal>
                </Box>
              </TableCell>
            </TableBody>
          ))}
        </Table>
      </TableContainer>
    </div>
  );
};

export default BonusCodes;

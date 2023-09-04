import React, { useEffect, useState, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import styled from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash, faBan } from '@fortawesome/fontawesome-free-solid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import ActionIcon from '../../../../../assets/images/settings.png';
import {
  getModeratorsAction,
  deleteModeratorAction,
  editModeratorAction,
  blockModeratorAction,
} from '../../../../../store/slices/userAuth/actions';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import { useMediaQuery } from '@mui/material';
import CloseIcon from '../../../../../assets/images/navClose.png';

const btnModel = {
  minWidth: '0',
};
const mainHeading = {
  marginBottom: '10px',
};

const Moderator = () => {
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
  const [open, setOpen] = useState(false);
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mods, setMods] = useState();
  const dispatch = useDispatch();
  const [openDeleteId, setOpenDeleteId] = useState(null);

  const [openBlockId, setOpenBlockId] = useState(null);
  const [openEditId, setOpenEditId] = React.useState(null);
  const handleCloseEdit = () => setOpenEditId(null);
  const handleOpenEdit = (mod) => {
    setOpenEditId(mod?.id);
    setUsername(mod?.userName);
    setEmail(mod?.email);
  };

  const handleOpenBlock = (id) => {
    setOpenBlockId(id);
  };
  const handleModalClose = () => {
    setOpenEditId(null);
  };

  const handleEditMod = async (mod) => {
    try {
      const payload = {
        id: mod?.id,
        email,
        userName,
      };
      dispatch(editModeratorAction(payload))
        .then(unwrapResult)
        .then((result) => {
          setMods((prev) => prev?.map((item) => (item.id === result.id ? result : item)));
        });
      handleCloseEdit();
    } catch (error) {
      console.error('Error deleting bonus code:', error);
    }
  };
  const fetchModerators = useCallback(async () => {
    dispatch(getModeratorsAction())
      .then(unwrapResult)
      .then((result) => {
        setMods(result);
      })
      .catch((error) => { });
  }, []);

  useEffect(() => {
    fetchModerators();
  }, [fetchModerators]);

  const handleOpenDelete = (id) => {
    setOpenDeleteId(id);
  };

  const handleBlockModerator = async (mod) => {
    try {
      const payload = {
        userId: mod?.id,
        status: 'BLOCK',
      };
      dispatch(blockModeratorAction(payload))
        .then(unwrapResult)
        .then((result) => {
          setMods((prev) => prev?.map((item) => (item.id === result.id ? result : item)));
          handleCloseBlock();
        });
    } catch (error) {
      console.error('Error deleting bonus code:', error);
    }
  };

  const handleDeleteModerator = async (mod) => {
    try {
      const payload = {
        id: mod?.id,
      };
      dispatch(deleteModeratorAction(payload));
      setMods((prevMods) => prevMods.filter((filterMod) => filterMod.id !== mod.id));
      handleCloseDelete();
    } catch (error) {
      console.error('Error deleting bonus code:', error);
    }
  };
  const handleCloseDelete = () => setOpenDeleteId(null);

  const handleCloseBlock = () => setOpenBlockId(null);

  return (
    <div>
      <Typography variant='h6' sx={mainHeading}>
        Dashboard {'>'} Moderator
      </Typography>
      <div className={styled.mobileView}>
        <table width='100%' className={styled.allFakeUser}>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Action</th>
          </tr>

          <>
            {mods?.map((mod) => (
              <tr key={mod?.id}>
                <td>{mod?.userName}</td>
                <td>{mod?.email}</td>
                <td>
                  <Button onClick={() => handleOpenEdit(mod)}>
                    {/* <FontAwesomeIcon icon={faEye} /> */}
                    <img
                      style={{
                        height: '20px',
                        width: '20px',
                        filter:
                          'invert(33%) sepia(96%) saturate(1029%) hue-rotate(183deg) brightness(96%) contrast(89%)',
                      }}
                      src={ActionIcon}
                      alt='img'
                    />
                  </Button>
                  <Modal
                    keepMounted
                    open={openEditId === mod?.id}
                    onClose={handleCloseEdit}
                    aria-labelledby='keep-mounted-modal-title'
                    aria-describedby='keep-mounted-modal-description'
                  >
                    <Box sx={style}>
                      <Button onClick={handleModalClose} className={styled.closeBtnModal}>
                        <img src={CloseIcon} alt='cross icon' />
                      </Button>
                      <Typography id='keep-mounted-modal-title' variant='h6' component='h2'>
                        Edit Form
                      </Typography>
                      <div className={styled.createFakeUser}>
                        <form>
                          <div className={`${styled.fromGroup} ${styled.fromGroupFull}`}>
                            <label>Username</label>
                            <input
                              value={userName}
                              onChange={(e) => setUsername(e.target.value)}
                              type='text'
                              name='username'
                            />
                          </div>
                          <div className={`${styled.fromGroup} ${styled.fromGroupFull}`}>
                            <label>Email</label>
                            <input
                              type='email'
                              name='email'
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className={`${styled.fromGroup} ${styled.fromGroupFull}`}>
                            <button onClick={() => handleEditMod(mod)}>Submit</button>
                          </div>
                        </form>
                      </div>
                    </Box>
                  </Modal>
                  <Button
                    sx={btnModel}
                    onClick={() => handleOpenBlock(mod?.id)}
                    disabled={mod?.status === 'BLOCK'}
                  >
                    <FontAwesomeIcon icon={faBan} />
                  </Button>
                  <Modal
                    // key={`modal-${mod?.id}`}
                    aria-labelledby='transition-modal-title'
                    aria-describedby='transition-modal-description'
                    keepMounted
                    open={openBlockId === mod?.id}
                    onClose={handleCloseBlock}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                      backdrop: {
                        timeout: 500,
                      },
                    }}
                  >
                    <Fade in={openBlockId === mod?.id}>
                      <Box sx={style}>
                        <Typography>Are you sure to Block the record?</Typography>
                        <Button onClick={() => handleBlockModerator(mod)}>Confirm Block</Button>
                        <Button onClick={handleCloseBlock}>Cancel</Button>
                      </Box>
                    </Fade>
                  </Modal>
                  <Button sx={btnModel} onClick={() => handleOpenDelete(mod?.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  <Modal
                    key={`modal-${mod?.id}`}
                    aria-labelledby='transition-modal-title'
                    aria-describedby='transition-modal-description'
                    open={openDeleteId === mod?.id}
                    onClose={handleCloseDelete}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                      backdrop: {
                        timeout: 500,
                      },
                    }}
                  >
                    <Fade in={openDeleteId === mod?.id}>
                      <Box sx={style}>
                        <Typography>Are you sure to Delete the record?</Typography>
                        <Button onClick={() => handleDeleteModerator(mod)}>Confirm Delete</Button>
                        <Button onClick={handleCloseDelete}>Cancel</Button>
                      </Box>
                    </Fade>
                  </Modal>
                </td>
              </tr>
            ))}
          </>
        </table>
      </div>
    </div>
  );
};

export default Moderator;

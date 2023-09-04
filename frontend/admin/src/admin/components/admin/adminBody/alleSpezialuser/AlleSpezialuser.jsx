/* eslint-disable */
import React, { useEffect, useState, useCallback } from 'react';
import styled from './style.module.css';
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
import { faEdit, faTrash, faBan } from '@fortawesome/fontawesome-free-solid';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateAccessAction,
  userListAction,
  adminBanModAction,
  adminEditAccessModAction,
} from '../../../../../store/slices/userAuth/actions';
import { unwrapResult } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: '1000px',
  bgcolor: 'background.paper',
  border: '1px solid #ccc',
  boxShadow: 24,
  p: 4,
};
const styleBan = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: '500px',
  bgcolor: 'background.paper',
  border: '1px solid #ccc',
  boxShadow: 24,
  borderRadius: '10px',
  p: 4,
};
const boxTableIcon = {
  display: 'inline-block',
};
const btnModel = {
  minWidth: '0',
};
const mainHeading = {
  marginBottom: '20px',
};
const mainHeadingsection = {
  marginBottom: '10px',
  textAlign: 'center',
};
const mainHeadingsectionBtns = {
  backgroundColor: '#fe5f2e',
  color: '#fff',
  padding: '10px 45px',
  margin: '0px 10px',
  ':hover': {
    backgroundColor: '#fe8e0e',
    color: '#fff',
    padding: '10px 45px',
    margin: '0px 10px',
  },
};

const AlleSpezialuser = () => {
  const updateRole = useSelector((state) => state.userAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openBan, setOpenBan] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState('');
  const [listData, setListData] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRow, setSelectedRow] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleCloseEdit = () => setOpenEdit(false);
  const handleCloseBan = () => setOpenBan(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenBan = (id, status) => {
    setSelectedRow(id);
    setSelectedStatus(status);
    setOpenBan(true);
  };
  const handleOpenEdit = (id, role) => {
    setSelectedRow(id);
    setSelectedRole(role);
    setOpenEdit(true);
  };

  const fetchUsersList = useCallback(async () => {
    dispatch(userListAction())
      .then(unwrapResult)
      .then((result) => {
        var listModresult = result.data.filter((element) => element.role === 'MODERATOR');
        setListData(result.data);
        setUserData(listModresult);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    fetchUsersList();
  }, [fetchUsersList]);

  const moderatorStatusSubmitHandler = async () => {
    selectedUsers?.map(user => {
      const payload = {
        userId: user,
        role: 'MODERATOR',
      };
      dispatch(updateAccessAction(payload))
        .then(unwrapResult)
        .then((result) => {
          fetchUsersList();
          setSelectedUsers([])
        })
        .catch((error) => {});
      })
  };

  // useEffect(() => {
  const onActionBan = async (userListData) => {
    const payload = {
      userId: userListData,
      status: selectedStatus === 'BLOCK' ? 'VERIFIED' : 'BLOCK',
    };
    dispatch(adminBanModAction(payload))
      .then(unwrapResult)
      .then((result) => {
        fetchUsersList();
        // navigate('/admin/Alle-Spezialuser');
      })
      .catch((error) => {});
    setOpenBan(false);

  };
  // }, []);

  // const openActionEdit = (id, status) => {
  //   setSelectedRow(id);
  //   setSelectedStatus(status);
  //   setOpenEdit(true);
  // };
  const onActionEdit = (userListData) => {
    // useEffect(() => {
    const payload = {
      userId: userListData,
      role: selectedRole === 'MODERATOR' ? 'CUSTOMER' : 'MODERATOR',
    };
    dispatch(adminEditAccessModAction(payload))
      .then(unwrapResult)
      .then((result) => {
        fetchUsersList();
      })
      .catch((error) => {});
    setOpenEdit(false);
    // }, [selectedRole, userListData]);
  };

  const ShowModal = ({ isVisible, handleClose, onYes, id, status }) => {
    return (
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={isVisible}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isVisible}>
          <Box sx={styleBan}>
            {selectedRole && selectedRole === 'MODERATOR' ? (
              <Typography variant='h6' sx={mainHeading}>
                Are you sure to Remove the Moderator Access
              </Typography>
            ) : selectedStatus && selectedStatus === 'BLOCK' ? (
              <Typography variant='h6' sx={mainHeading}>
                Are you sure to UnBan the Moderator
              </Typography>
            ) : (
              <Typography variant='h6' sx={mainHeading}>
                Are you sure to Ban the Moderator
              </Typography>
            )}

            <Box sx={mainHeadingsection}>
              <Button sx={mainHeadingsectionBtns} onClick={() => onYes(id)}>
                Yes
              </Button>

              <Button sx={mainHeadingsectionBtns} onClick={handleClose}>
                No
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    );
  };

  return (
    <div>
      <Box>
        <div className={styled.mainDiv1}>
          <Typography variant='h6' sx={mainHeading}>
            Dashboard {'>'} Spezialuser
          </Typography>
        </div>
        <div className={styled.mainDiv2}>
          <Button variant='outlined' size='medium' onClick={handleOpen}>
            Add Moderator
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <form
                className={styled.mainModelContainer}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleClose();
                  moderatorStatusSubmitHandler();
                }}
              >
                <div className={`${styled.mainModelSticky} ${styled.mainModel}`}>
                  <div className={styled.nameMod}>Name</div>
                  <div className={`${styled.roleMod}`}>
                    <span>Role</span>
                  </div>
                  <div className={`${styled.nameModStatuss}`}>
                    <span>Status</span>
                  </div>
                  <div className={`${styled.nameModEmail}`}>
                    <span>Email</span>
                  </div>
                  <div className={styled.selectionMod}>Actions</div>
                  <div className={styled.clear}></div>
                </div>
                {listData && (
                  <>
                    {listData?.map((userDataModal) => (
                      <>
                        <div className={styled.mainModel} id={userDataModal.id}>
                          <div className={styled.nameMod}>
                            {userDataModal.firstName} {userDataModal.lastName}
                          </div>
                          <div className={`${styled.roleMod} ${styled.roleUser}`}>
                            <span>{userDataModal.role}</span>
                          </div>
                          <div className={`${styled.nameModStatus}`}>
                            <span>{userDataModal.status}</span>
                          </div>
                          <div className={`${styled.nameModEmail}`}>
                            <span>{userDataModal.email}</span>
                          </div>
                          <div className={styled.selectionMod} id={userDataModal.id}>
                            <input
                              type='checkbox'
                              name='selection'
                              id={userDataModal.id}
                              onChange={(e) => setSelectedUsers([...selectedUsers,userDataModal.id])}
                            />
                          </div>
                          <div className={styled.clear}></div>
                        </div>
                      </>
                    ))}
                  </>
                )}

                <div className={styled.formBtn}>
                  <button>Add Moderator</button>
                </div>
              </form>
            </Box>
          </Modal>
        </div>
        <div className={styled.clear}></div>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='a dense table'>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Create Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          {userData && (
            <>
              {userData?.map((userListData) => (
                <>
                  <TableBody key={userListData.id} id={userListData.id}>
                    <TableCell>{userListData.firstName}</TableCell>
                    <TableCell>{userListData.email}</TableCell>
                    <TableCell>{userListData.role}</TableCell>
                    <TableCell>{userListData.status}</TableCell>
                    <TableCell>{userListData.createdAt}</TableCell>
                    <TableCell>
                      <form className={styled.formBoxbtns}>
                        <Box sx={boxTableIcon}>
                          <Button
                            sx={btnModel}
                            onClick={() => handleOpenEdit(userListData.id, userListData.role)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                        </Box>
                        <Box sx={boxTableIcon}>
                          <Button
                            sx={btnModel}
                            onClick={() => handleOpenBan(userListData.id, userListData.status)}
                          >
                            {userListData.status === 'BLOCK' ? (
                              <FontAwesomeIcon color='red' icon={faBan} />
                            ) : (
                              <FontAwesomeIcon icon={faBan} />
                            )}
                          </Button>
                        </Box>
                      </form>
                    </TableCell>
                  </TableBody>
                </>
                // )}
              ))}
              <ShowModal
                isVisible={openBan}
                handleClose={handleCloseBan}
                onYes={onActionBan}
                id={selectedRow}
              />
              <ShowModal
                isVisible={openEdit}
                handleClose={handleCloseEdit}
                onYes={onActionEdit}
                id={selectedRow}
              />
            </>
          )}
        </Table>
      </TableContainer>
    </div>
  );
};

export default AlleSpezialuser;

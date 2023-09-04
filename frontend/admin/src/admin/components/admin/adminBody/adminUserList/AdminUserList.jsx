import React, { useEffect, useState } from 'react';
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
import { faBan, faTrash } from '@fortawesome/fontawesome-free-solid';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { userListAction, verifyUserAction } from '../../../../../store/slices/userAuth/actions';
import MaleAvatr from '../../../../../assets/images/male.png';
import FemaleAvatr from '../../../../../assets/images/female.png';
import { useMediaQuery } from '@material-ui/core';
import styled from './style.module.css';
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

const AdminUserList = () => {
  const isMobile = useMediaQuery('(max-width: 786px)');
  const imagePreviewStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    padding: 0,
    height: 'auto',
    width: isMobile ? 'auto' : 'auto',
  };
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const dispatch = useDispatch();
  const userList = useSelector((state) => state?.userAuth?.usersList);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    dispatch(userListAction());
    setRefresh(false);
  }, [refresh]);
  useEffect(() => {
    dispatch(userListAction());
  }, []);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  // function Modal({ open, children, onClose }) {
  //   if (!open) return null;

  //   return (
  //     <div
  //       style={{
  //         position: 'fixed',
  //         top: 0,
  //         left: 0,
  //         right: 0,
  //         bottom: 0,
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         backgroundColor: 'background.paper',
  //         width: '100%',
  //         height: '100%',
  //         zIndex: '999',
  //       }}
  //     >
  //       <div
  //         style={{
  //           backgroundColor: 'background.paper',
  //           padding: '20em 0 0',
  //           borderRadius: '8px',
  //           maxWidth: '100%',
  //           maxHeight: '100%',
  //           overflow: 'auto',
  //           backdropFilter: 'blur(3px) !important',
  //           textAlign: 'center',
  //         }}
  //       >
  //         {children}
  //       </div>
  //     </div>
  //   );
  // }

  const [selectedImage, setSelectedImage] = useState(null);

  const openImageModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setImageModalOpen(false);
  };

  const handleVerifyUser = (userId) => {
    dispatch(verifyUserAction(userId));
    setRefresh(true);
  };

  useEffect(() => {
    setRefresh(true);
  }, []);

  return (
    <div>
      <Typography variant='h6' sx={mainHeading}>
        Dashboard {'>'} Users
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='a dense table'>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>User Role</TableCell>
              <TableCell>Create Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          {userList && userList.length > 0 ? (
            userList?.map((user) => (
              <TableBody>
                <TableCell>
                  {user?.profile?.avatarUrl === null ? (
                    user?.selfGender === 'Male' ? (
                      <img
                        src={MaleAvatr}
                        alt=''
                        className={styled.userAvatar}
                        onClick={() => openImageModal(MaleAvatr)}
                        style={{ cursor: 'pointer' }}
                      />
                    ) : (
                      <img
                        src={FemaleAvatr}
                        alt=''
                        className={styled.userAvatar}
                        onClick={() => openImageModal(FemaleAvatr)}
                        style={{ cursor: 'pointer' }}
                      />
                    )
                  ) : (
                    <img
                      src={user?.profile?.avatarUrl}
                      alt=''
                      className={styled.userAvatar}
                      onClick={() => openImageModal(user?.profile?.avatarUrl)}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                </TableCell>
                {/* <TableCell><img src={user?.profile?.avatarUrl} alt='Image' /></TableCell> */}
                <TableCell>
                  {user?.userName}

                </TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell>{user?.selfGender}</TableCell>
                <TableCell>{user?.address?.address}</TableCell>
                <TableCell>{user?.role}</TableCell>
                <TableCell>{user?.createdAt}</TableCell>
                <TableCell>{user?.profile?.isProfileVerified}</TableCell>
                <TableCell>
                  {/* <Box sx={boxTableIcon}>
                    <Button sx={btnModel} onClick={handleOpenEdit}>
                      <FontAwesomeIcon icon={faBan} />
                    </Button>
                    <Modal
                      aria-labelledby='transition-modal-title'
                      aria-describedby='transition-modal-description'
                      open={openEdit}
                      onClose={handleCloseEdit}
                      closeAfterTransition
                      slots={{ backdrop: Backdrop }}
                      slotProps={{
                        backdrop: {
                          timeout: 500,
                        },
                      }}
                    >
                      <Fade in={openEdit}>
                        <Box sx={style}>Are you sure to Block the Moderator</Box>
                      </Fade>
                    </Modal>
                  </Box> */}
                  <Box sx={boxTableIcon}>
                    {/* <Button sx={btnModel} onClick={handleOpenDelete}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button> */}
                    <Modal
                      aria-labelledby='transition-modal-title'
                      aria-describedby='transition-modal-description'
                      open={openDelete}
                      onClose={handleCloseDelete}
                      closeAfterTransition
                      slots={{ backdrop: Backdrop }}
                      slotProps={{
                        backdrop: {
                          timeout: 500,
                        },
                      }}
                    >
                      <Fade in={openDelete}>
                        <Box sx={style}>Are you sure to Delete the record</Box>
                      </Fade>
                    </Modal>
                  </Box>
                  <input
                    type='checkbox'
                    id='notification'
                    name='verifyUser'
                    checked={user?.profile?.isProfileVerified === 'VERIFIED'}
                    disabled={user?.profile?.isProfileVerified === 'VERIFIED'}
                    onClick={() => handleVerifyUser(user.id)}
                    style={{ verticalAlign: 'middle', cursor: "pointer" }}
                  />
                </TableCell>
              </TableBody>
            ))
          ) : (
            <p style={{ padding: '10px' }}>Loading user list...</p>
          )}
          {/* <Modal open={isModalOpen}>
            <img
              src={selectedImage}
              onClick={closeImageModal}
              alt='Opened in modal'
              style={{
                maxWidth: '40%',
                maxHeight: '50%',
                width: 'auto',
                height: 'auto',
                margin: '0px auto',
              }}
            />
          </Modal> */}
          <Modal open={isImageModalOpen}>
            <Box sx={imagePreviewStyle}>
              <Button onClick={closeImageModal} className={styled.imagePreviewCloseBtnModal}>
                <img src={CloseIcon} alt='cross icon' />
              </Button>
              <img src={selectedImage} style={{ height: '100%', maxWidth: '350px' }} />
            </Box>
          </Modal>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminUserList;

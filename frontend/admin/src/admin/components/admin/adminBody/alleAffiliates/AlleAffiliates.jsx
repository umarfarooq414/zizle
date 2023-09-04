import React from 'react';
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

const AlleAffiliates = () => {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  return (
    <div>
      <Typography variant='h6' sx={mainHeading}>
        Dashboard {'>'} Spezial User
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='a dense table'>
          <TableHead>
            <TableRow>
              <TableCell>Moderator Title</TableCell>
              <TableCell>Moderator Email</TableCell>
              <TableCell>Create Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableCell>Dummy Text</TableCell>
            <TableCell>info@domain.com</TableCell>
            <TableCell>12/03/2023</TableCell>
            <TableCell>
              <Box sx={boxTableIcon}>
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
                    <Box sx={style}>Are you sure to Block the record</Box>
                  </Fade>
                </Modal>
              </Box>
              <Box sx={boxTableIcon}>
                <Button sx={btnModel} onClick={handleOpenDelete}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
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
            </TableCell>
          </TableBody>
          <TableBody>
            <TableCell>Dummy Text</TableCell>
            <TableCell>info@domain.com</TableCell>
            <TableCell>12/03/2023</TableCell>
            <TableCell>
              <Box sx={boxTableIcon}>
                <Button sx={btnModel} onClick={handleOpenEdit}>
                  <FontAwesomeIcon icon={faBan} />
                </Button>
                <Modal
                  aria-labelledby='transition-modal-title'
                  aria-describedby='transition-modal-description'
                  open={openEdit}
                  onClose={handleCloseDelete}
                  closeAfterTransition
                  slots={{ backdrop: Backdrop }}
                  slotProps={{
                    backdrop: {
                      timeout: 500,
                    },
                  }}
                >
                  <Fade in={openEdit}>
                    <Box sx={style}>Are you sure to Block the record</Box>
                  </Fade>
                </Modal>
              </Box>
              <Box sx={boxTableIcon}>
                <Button sx={btnModel} onClick={handleOpenDelete}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
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
            </TableCell>
          </TableBody>
          <TableBody>
            <TableCell>Dummy Text</TableCell>
            <TableCell>info@domain.com</TableCell>
            <TableCell>12/03/2023</TableCell>
            <TableCell>
              <Box sx={boxTableIcon}>
                <Button sx={btnModel} onClick={handleOpenEdit}>
                  <FontAwesomeIcon icon={faBan} />
                </Button>
                <Modal
                  aria-labelledby='transition-modal-title'
                  aria-describedby='transition-modal-description'
                  open={openEdit}
                  onClose={handleCloseDelete}
                  closeAfterTransition
                  slots={{ backdrop: Backdrop }}
                  slotProps={{
                    backdrop: {
                      timeout: 500,
                    },
                  }}
                >
                  <Fade in={openEdit}>
                    <Box sx={style}>Are you sure to Block the record</Box>
                  </Fade>
                </Modal>
              </Box>
              <Box sx={boxTableIcon}>
                <Button sx={btnModel} onClick={handleOpenDelete}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
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
            </TableCell>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AlleAffiliates;
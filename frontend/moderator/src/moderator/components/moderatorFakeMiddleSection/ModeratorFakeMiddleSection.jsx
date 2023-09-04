import React from 'react';
import styled from './style.module.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useDispatch, useSelector } from 'react-redux';
import { sendBulkVistsAction, emptyStateAction } from '../../../store/slices/moderatorApi/actions';
import { setFakeUserBulkId, setRealCustomerBulkId, emptyState } from '../../../store/slices/moderatorApi/moderatorApiSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ModeratorFakeMiddleSection = () => {
  const moderatorApiData = useSelector((state) => state.moderatorApi)
  const { fakeUserBulkIds, realCustomerBulkIds } = useSelector((state) => state.moderatorApi)
  // const fakeIds = [...new Set(fakeUserBulkIds)];
  // const realIds = [...new Set(realCustomerBulkIds)];

  const fakeIds = [...new Set(fakeUserBulkIds.map(user => user?.id))];
  const realIds = [...new Set(realCustomerBulkIds.map(user => user?.id))];
  const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch()
  const handleClick = () => {
    const payload = {
      fakeUserIds: fakeIds,
      customerUserIds: realIds
    }
    dispatch(sendBulkVistsAction(payload))
    dispatch(emptyState());
  }
  return (
    <>
      <div className={styled.moderatorMiddleMain}>
        <div className={styled.middleButton}>
          <button onClick={handleClick}>Send Visits to User</button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              {/* <Typography id='modal-modal-title' variant='h6' component='h2'>
                Text in a modal
              </Typography> */}
              <ReportProblemIcon sx={{ fontSize: 50, textAlign: 'center', margin: "auto", display: "block" }} />
              <Typography id='modal-modal-description' sx={{ mt: 2, textAlign: 'center', fontSize: "18px", }}>
                Select atleast 1 fake user and 1 Real user
              </Typography>
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
};
export default ModeratorFakeMiddleSection;

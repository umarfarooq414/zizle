import React, { useState, useEffect, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import styled from './style.module.css';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/fontawesome-free-solid';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import ActionIcon from '../../../../../assets/images/settings.png';
import {
  subscriptionsUserListAction,
  subscriptionEditAccessAction,
  subsDeleteAccessAction,
} from '../../../../../store/slices/userAuth/actions';
import { useMediaQuery } from '@mui/material';

import CloseIcon from '../../../../../assets/images/navClose.png';
const mainHeading = {
  marginBottom: '20px',
};

const AdminSubscription = () => {
  const isMobile = useMediaQuery('(max-width: 786px)');
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? 350 : 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = React.useState(false);
  const [listData, setListData] = useState('');

  const handleOpen = (id, packageName, coins, amount, topselling) => {
    setId(id);
    setPackageName(packageName);
    setNoOfCoins(coins);
    setAmount(amount);
    setBestSelling(topselling);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [id, setId] = useState('');
  const [packageName, setPackageName] = useState('');
  const [noOfCoins, setNoOfCoins] = useState('');
  const [amount, setAmount] = useState('');
  const [bestSelling, setBestSelling] = useState();
  const toggleChecked = () => setBestSelling((value) => !value);

  const dispatch = useDispatch();

  const subscriptionHandleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id,
      packageName,
      noOfCoins,
      amount,
      bestSelling,
    };
  };

  const fetchUsersList = useCallback(async () => {
    dispatch(subscriptionsUserListAction())
      .then(unwrapResult)
      .then((result) => {
        setListData(result.data);
      })
      .catch((error) => { });
  }, []);

  const onActionEdit = (e) => {
    e.preventDefault();
    const payload = {
      id,
      packageType: packageName,
      noOfCoins: parseInt(noOfCoins),
      amount: parseInt(amount),
      bestSelling,
    };
    dispatch(subscriptionEditAccessAction(payload))
      .then(unwrapResult)
      .then((result) => {
        fetchUsersList();
        setOpen(false);
      })
      .catch((error) => { });
  };

  const onActionDelete = (id) => {
    const payload = {
      id: id,
    };
    dispatch(subsDeleteAccessAction(payload))
      .then(unwrapResult)
      .then((result) => {
        fetchUsersList();
      })
      .catch((error) => { });
  };

  useEffect(() => {
    fetchUsersList();
  }, [fetchUsersList]);

  return (
    <div>
      <Typography variant='h6' sx={mainHeading}>
        Dashboard {'>'} Admin Subscription
      </Typography>
      <div className={styled.mobileView}>
        <table width='100%' className={styled.allSubscription}>
          <tr>
            <th>Package Type</th>
            <th>Best selling</th>
            <th>No of coins</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>

          {listData && (
            <>
              {listData?.map((userListData) => (
                <>
                  <tr>
                    <td>{userListData.packageName}</td>
                    <td>{userListData.bestSelling ? 'Yes' : 'No'}</td>
                    <td>{userListData.noOfCoins}</td>
                    <td>{userListData.amount}</td>
                    <td>
                      <Button onClick={() => onActionDelete(userListData.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                      <Button
                        onClick={() =>
                          handleOpen(
                            userListData.id,
                            userListData.packageName,
                            userListData.noOfCoins,
                            userListData.amount,
                            userListData.bestSelling,
                          )
                        }
                      >
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
                        open={open}
                        onClose={handleClose}
                        id={userListData.id}
                        aria-labelledby='modal-modal-title'
                        aria-describedby='modal-modal-description'
                      >
                        <Box sx={style}>
                          <Button onClick={handleClose} className={styled.closeBtnModal}>
                            <img src={CloseIcon} alt='cross icon' />
                          </Button>

                          <Typography id='modal-modal-title' variant='h6' component='h2'>
                            Update Form
                          </Typography>
                          <form
                            onSubmit={(e) => {
                              subscriptionHandleSubmit(e);
                            }}
                          >
                            <div className={styled.fromGroup}>
                              <label>Package Name</label>
                              <input
                                type='text'
                                value={packageName}
                                onChange={(e) => setPackageName(e.target.value)}
                              />
                            </div>
                            <div className={styled.fromGroup}>
                              <label>No of coins</label>
                              <input
                                type='text'
                                value={noOfCoins}
                                onChange={(e) => setNoOfCoins(e.target.value)}
                              />
                            </div>
                            <div className={styled.fromGroup}>
                              <label>Amount</label>
                              <input
                                type='text'
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                              />
                            </div>
                            <div className={styled.fromGroup}>
                              <label>Best seller</label>
                              <label className={styled.toggle}>
                                <input
                                  className={styled.toggle_checkbox}
                                  type='checkbox'
                                  checked={bestSelling}
                                  onChange={toggleChecked}
                                />
                                <div className={styled.toggle_switch}></div>
                                <span className={styled.toggle_label}></span>
                              </label>
                            </div>
                            <div className={styled.fromGroup}>
                              <button onClick={onActionEdit}>Submit</button>
                            </div>
                          </form>
                        </Box>
                      </Modal>

                    </td>
                  </tr>
                </>
              ))}
            </>
          )}
        </table>
      </div>
    </div>
  );
};
export default AdminSubscription;

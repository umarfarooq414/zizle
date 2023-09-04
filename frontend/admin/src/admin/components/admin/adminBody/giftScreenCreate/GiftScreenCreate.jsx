import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import styled from './style.module.css';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { resigterGiftAction } from '../../../../../store/slices/userAuth/actions';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
const mainHeading = {
  marginBottom: '10px',
};

const GiftScreenCreate = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [noOfCoins, setNoOfCoins] = useState(0);
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();
  const [listData, setListData] = useState([]);
  const [loading,setLoading]=useState(false)

  const giftSubmitHandle = (e) => {
    setLoading(true)
    // var encoded = btoa(JSON.stringify(selectedFile))
    const payload = {
      actionType: title,
      cost: parseInt(noOfCoins),
      imageUrl: selectedFile,
    }

console.log(typeof payload.cost)
    if (title !== null && selectedFile !== null && noOfCoins !== null) {
      dispatch(resigterGiftAction(payload))
        .then(unwrapResult)
        .then((result) => {
          setListData(result);
                    setLoading(false)

        })
        .catch((error) => {
          setLoading(false)
        });

      
    } else {
      if (title === null || typeof title !== 'string') {
        toast.error('Please enter a valid title', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      if (selectedFile === null) {
        toast.error('Please select a file', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      if (noOfCoins === null||typeof noOfCoins !== 'number') {
        toast.error('Please enter the valid number of coins', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
          setLoading(false)

    }
  }

  return (
    <div>
      <Typography variant='h6' sx={mainHeading}>
        Dashboard {'>'} Create Gifts
      </Typography>

      <div className={styled.formCreateCoin}>
        <form onSubmit={giftSubmitHandle} enctype="multipart/form-data">
          <div className={styled.formGroup}>
            <label htmlFor="fileInput">Select a file:</label>
            <input type='file' accept="images/*" id="fileInput" onChange={(event) => setSelectedFile(event.target.files[0])} />
          </div>
          <div className={styled.formGroup}>
            <label>Cost</label>
            <input type='text' onChange={(event) => setNoOfCoins(`-` + event.target.value)} />
            <p>Enter cost in positive (without '-' sign) for those actions, for which user coins should be deducted!</p>
          </div>
          <div className={styled.formGroup}>
            <label>Title</label>
            <input type='text' onChange={(event) => setTitle(event.target.value)} />
          </div>
          <div className={styled.formGroup}>
            <Button variant='contained' onClick={giftSubmitHandle}>
                                          
  Submit {loading ? <CircularProgress color='secondary' size={20} style={{ marginLeft: '0px' }} /> : ''}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GiftScreenCreate;

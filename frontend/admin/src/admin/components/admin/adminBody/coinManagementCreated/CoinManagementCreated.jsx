import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
// import styled from './style.module.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

const mainHeading = {
  marginBottom: '10px',
};

const CoinManagementCreated = () => {
  const [coinPerMessage, setCoinPerMessage] = useState('');
  const [coinPerEmailVerification, setCoinPerEmailVerification] = useState('');
  const [coinPerBlurView, setCoinPerBlurView] = useState('');
  const [coinPerEmojiReaction, setCoinPerEmojiReaction] = useState('');
  const [coinPerViewProfileVisitor, setCoinPerViewProfileVisitor] = useState('');
  const [coinPerUploadAvatar, setCoinPerUploadAvatar] = useState('');
  const [coinPerProfileVerified, setCoinPerProfileVerified] = useState('');
  const [coinPerAddPhoneNumber, setCoinPerAddPhoneNumber] = useState('');

  const coinManagementHandler = (e) => {
    e.preventDefault();
    const payload = {
      coinPerMessage: coinPerMessage,
      coinPerEmailVerification: coinPerEmailVerification,
      coinPerBlurView: coinPerBlurView,
      coinPerEmojiReaction: coinPerEmojiReaction,
      coinPerViewProfileVisitor: coinPerViewProfileVisitor,
      coinPerUploadAvatar: coinPerUploadAvatar,
      coinPerProfileVerified: coinPerProfileVerified,
      coinPerAddPhoneNumber: coinPerAddPhoneNumber,
    };
  };

  return (
    <Box>
      <Typography variant='h6' sx={mainHeading}>
        Dashboard {'>'} Create Coin Management
      </Typography>
      <form onSubmit={coinManagementHandler}>
        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
            marginTop: '30px',
            marginBottom: '25px',
          }}
        >
          <TextField
            inputProps={{ inputMode: 'numeric', pattern: '[0-99]*' }}
            fullWidth
            label='No. of Coin per Message'
            id='no-of-Coin-per-Message'
            onChange={(e) => setCoinPerMessage(e.target.value)}
          />
        </Box>

        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
            marginBottom: '25px',
          }}
        >
          <TextField
            fullWidth
            inputProps={{ inputMode: 'numeric', pattern: '[0-99]*' }}
            label='No. of coins per email verification'
            id='no-of-coins-per-email-verification'
            onChange={(e) => setCoinPerEmailVerification(e.target.value)}
          />
        </Box>

        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
            marginBottom: '25px',
          }}
        >
          <TextField
            fullWidth
            inputProps={{ inputMode: 'numeric', pattern: '[0-99]*' }}
            label='No. of coins per blur picture view'
            id='no-of-coins-per-blur-picture-view'
            onChange={(e) => setCoinPerBlurView(e.target.value)}
          />
        </Box>

        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
            marginBottom: '25px',
          }}
        >
          <TextField
            fullWidth
            inputProps={{ inputMode: 'numeric', pattern: '[0-99]*' }}
            label='No. of coins per profile emoji reaction'
            id='no-of-coins-per-profile-emoji-reaction'
            onChange={(e) => setCoinPerEmojiReaction(e.target.value)}
          />
        </Box>

        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
            marginBottom: '25px',
          }}
        >
          <TextField
            fullWidth
            inputProps={{ inputMode: 'numeric', pattern: '[0-99]*' }}
            label='No. of coins per view profile visitor'
            id='no-of-coins-per-view-profile-visitor'
            onChange={(e) => setCoinPerViewProfileVisitor(e.target.value)}
          />
        </Box>

        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
            marginBottom: '25px',
          }}
        >
          <TextField
            fullWidth
            inputProps={{ inputMode: 'numeric', pattern: '[0-99]*' }}
            label='No. of coins per upload avatar'
            id='no-of-coins-per-upload-avatar'
            onChange={(e) => setCoinPerUploadAvatar(e.target.value)}
          />
        </Box>

        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
            marginBottom: '25px',
          }}
        >
          <TextField
            fullWidth
            inputProps={{ inputMode: 'numeric', pattern: '[0-99]*' }}
            label='No. of coins per profile verified'
            id='no-of-coins-per-profile-verified'
            onChange={(e) => setCoinPerProfileVerified(e.target.value)}
          />
        </Box>

        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
            marginBottom: '25px',
          }}
        >
          <TextField
            fullWidth
            inputProps={{ inputMode: 'numeric', pattern: '[0-99]*' }}
            label='No. of coins per add phone number'
            id='no-of-coins-per-add-phone-number'
            onChange={(e) => setCoinPerAddPhoneNumber(e.target.value)}
          />
        </Box>

        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
          }}
        >
          <Button variant='contained' endIcon={<SendIcon />}>
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CoinManagementCreated;

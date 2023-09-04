import React, { useEffect, useState, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import styled from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/fontawesome-free-solid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  getModeratorsAction,
  deleteModeratorAction,
  chatModeratorAction,
} from '../../../../../store/slices/userAuth/actions';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../../../providers/useUser';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid',
  boxShadow: 24,
  p: 4,
};
const btnModel = {
  minWidth: '0',
};
const mainHeading = {
  marginBottom: '10px',
};

const Statistics = () => {
  // const [open, setOpen] = useState(false);
  // const [userName, setUsername] = useState('');
  // const [email, setEmail] = useState('');
  const [mods, setMods] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useUser()
  const accessToken = token;

  const handleEditMod = async (mod) => {
    try {
      const payload = {
        modId: mod?.id,
        duration: 'monthly',
        token: accessToken,
      };

      dispatch(chatModeratorAction(payload))
        .then(unwrapResult)
        .then((result) => {
          setMods(result);
          navigate('/admin/statistics/details', { state: { chat: result } });
        });
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
      .catch((error) => {
      });
  }, []);

  useEffect(() => {
    fetchModerators();
  }, [fetchModerators]);

  return (
    <div>
      <Typography variant='h6' sx={mainHeading}>
        Dashboard {'>'} Moderator {'>'} Statistics
      </Typography>

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
                <Button onClick={() => handleEditMod(mod)}>
                  <FontAwesomeIcon icon={faEye} />
                </Button>
              </td>
            </tr>
          ))}
        </>
      </table>
    </div>
  );
};

export default Statistics;

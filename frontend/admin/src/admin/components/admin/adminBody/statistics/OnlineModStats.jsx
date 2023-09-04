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
  getModeratorsAction, deleteModeratorAction, onlineModeratorAction
} from '../../../../../store/slices/userAuth/actions';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import { useNavigate } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HC_exporting from 'highcharts/modules/exporting';
import { useUser } from '../../../../../providers/useUser';
HC_exporting(Highcharts);

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

const Moderator = () => {
  const { token } = useUser()

  // const tokenItem = localStorage.getItem("token");
  // const { token } = tokenItem ? JSON.parse(tokenItem) : {};
  const [open, setOpen] = useState(false);
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [modsOnline, setOnlineMods] = useState()
  const [mods, setMods] = useState()
  const dispatch = useDispatch()
  const navigate = useNavigate();




  const fetchModerators = useCallback(async () => {
    dispatch(onlineModeratorAction()).then(unwrapResult).then((result) => {
      setOnlineMods(result);
    })
    dispatch(getModeratorsAction())
      .then(unwrapResult)
      .then((result) => {
        setMods(result)
      })
      .catch((error) => {
      });
  }, []);

  useEffect(() => {
    if (token) {
      fetchModerators();
    }
  }, [fetchModerators, token]);


  const chartOptionsrecieved = {
    title: {
      text: ""
    },
    exporting: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    tooltip: {
      enabled: false
    },
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<td style="padding:0"><b> {point.y}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      pie: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          color: "rgba(0,0,0,0.87)",
          style: {
            fontWeight: "normal",
            textOutline: "none"
          },
          connectorWidth: 0,
          distance: 10,
          formatter() {
            return `${this.y}<br> ${this.point.name}`;
          }
        }
      }
    },
    series: [
      {
        type: "pie",
        innerSize: "50%",
        data: [
          {
            name: "Customers",
            y: modsOnline?.customers?.length
          },
          {
            name: "Moderators",
            y: modsOnline?.moderators?.length
          }
        ]
      }
    ]
  };

  return (
    <div>
      <Typography variant='h6' sx={mainHeading}>
        Dashboard {'>'} Moderator {'>'} Online Statistics
      </Typography>
      <HighchartsReact highcharts={Highcharts} options={chartOptionsrecieved} />


    </div>
  );
};

export default Moderator;

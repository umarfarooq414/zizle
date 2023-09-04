import React from 'react';
import Highcharts from 'highcharts';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import HighchartsReact from 'highcharts-react-official';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);

const StatisticsDetails = () => {
  const { state } = useLocation();

  const { chat } = state || {};
  const navigate = useNavigate();

  const mainHeading = {
    marginBottom: '10px',
  };

  const theme = {
    blue: {
      default: '#3f51b5',
      hover: '#283593',
    },
    pink: {
      default: '#eb6b34',
      hover: '#c44008',
    },
  };

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const Button = styled.button`
    background-color: ${(props) => theme[props.theme].default};
    color: white;
    padding: 5px 15px;
    border-radius: 5px;
    outline: 0;
    text-transform: uppercase;
    margin: 10px 0px;
    cursor: pointer;
    box-shadow: 0px 2px 2px lightgray;
    transition: ease background-color 250ms;
    &:hover {
      background-color: ${(props) => theme[props.theme].hover};
    }
    &:disabled {
      cursor: default;
      opacity: 0.7;
    }
  `;

  function clickMe() {
    navigate('/admin/statistics');
  }

  function getChatDates(array) {
    const chatDates = [];

    array.forEach((item) => {
      item.chats.forEach((chat) => {
        const date = new Date(chat.chatDate);
        const day = date.getDate();

        chatDates.push(day);
      });
    });

    return chatDates;
  }

  const prepareMsgRepliesPayload = () => {
    let response = [];

    months.forEach((month, index) => {
      if (chat?.length) {
        const value = chat[1]?.find((entity) => {
          if (month === entity.Month) {
            return entity;
          }
        });
        if (value) {
          response[index] = value.MessageReplies;
        } else {
          response[index] = 0;
        }
      }
    });
    return response;
  };

  const prepareMsgSentPayload = () => {
    let response = [];

    months.forEach((month, index) => {
      if (chat?.length) {
        const value = chat[0]?.find((entity) => {
          if (month === entity.Month) {
            return entity;
          }
        });
        if (value) {
          response[index] = value.SendMessages;
        } else {
          response[index] = 0;
        }
      }
    });
    return response;
  };

  const chartOptionsrecieved = {
    chart: {
      type: 'column',
    },
    credits: {
      enabled: false,
    },
    title: {
      text: 'Monthly Receive Message',
    },
    // subtitle: {
    //     text: 'Source: WorldClimate.com'
    // },
    xAxis: {
      categories: months,
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Messages',
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: 'Messages Received',
        data: prepareMsgRepliesPayload(),
      },
    ],
  };

  const chartOptionssend = {
    chart: {
      type: 'column',
    },
    credits: {
      enabled: false,
    },
    title: {
      text: 'Monthly Sent Message',
    },
    // subtitle: {
    //     text: 'Source: WorldClimate.com'
    // },
    xAxis: {
      categories: months,
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Messages',
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: 'Messages Sent',
        data: prepareMsgSentPayload(),
      },
    ],
  };

  return (
    <div>
      <Typography variant='h6' sx={mainHeading}>
        Dashboard {'>'} Moderator {'>'} Statistics {'>'} Details
      </Typography>
      <Button theme='pink' onClick={clickMe}>
        Go Back
      </Button>
      <HighchartsReact highcharts={Highcharts} options={chartOptionsrecieved} />
      <HighchartsReact highcharts={Highcharts} options={chartOptionssend} />
    </div>
  );
};

export default StatisticsDetails;

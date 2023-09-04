import React from 'react';
import styled from './style.module.css';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAdminStats } from '../../../../../store/slices/adminAPI/actions';
import { unwrapResult } from '@reduxjs/toolkit';
import openMessage from '../../../../../assets/images/openMessage.png';
import history from '../../../../../assets/images/history.png';
import dollar from '../../../../../assets/images/dollar-symbol.png';
import user from '../../../../../assets/images/user.png';
import redUser from '../../../../../assets/images/redUser.png';
import mods from '../../../../../assets/images/group.png';
import mail from '../../../../../assets/images/email.png';
import { useState } from 'react';
import { useTable } from 'react-table';
import { useMemo } from 'react';
import { useUser } from '../../../../../providers/useUser';
import Typography from '@mui/material/Typography';

const mainHeading = {
  marginBottom: '10px',
};

const AdminDashboard = () => {
  const { token } = useUser();
  // const tokenItem = localStorage.getItem("token");
  // const { token } = tokenItem ? JSON.parse(tokenItem) : {};
  const dispatch = useDispatch();
  const [stats, setStats] = useState(``);
  const [messageStats, setMessageStats] = useState([]);

  useEffect(() => {
    if (token) {
      dispatch(getAdminStats())
        .then(unwrapResult)
        .then((result) => {
          setStats(result);
          setMessageStats(result?.MessageStats);
        });
    }
  }, [token]);

  const getUsersCount = (users, condition) => {
    return users?.filter((user) => user.status === condition).length;
  };

  const data = useMemo(
    () =>
      messageStats?.map((data) => {
        return {
          userName: data?.mod?.userName,
          email: data?.mod?.email,
          status: data?.mod?.status,
          month:data?.sentToUser?.Month,
          messageSent: data?.sentToUser?.SendMessages,
          messageReplies: data?.repliesFromUser?.MessageReplies,
        };
      }),
    [messageStats],
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'userName', // accessor is the "key" in the data
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Month',
        accessor: 'month',
      },
      {
        Header: 'Message Sent',
        accessor: 'messageSent',
      },
      {
        Header: 'Message Replies',
        accessor: 'messageReplies',
      },
    ],
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <div>
      <Typography variant='h6' sx={mainHeading}>
        Dashboard
      </Typography>
      <div className={styled.recipients}>
        <div className={styled.tile}>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <div className={styled.tileTitle}>Open Messages</div>
              <div className={styled.tileNumber}> {stats.openMessages ?? '-'}</div>
            </div>
            <div className={styled.icon}>
              <img src={openMessage} alt='openMessage' className={styled.iconImage} />
            </div>
          </div>
        </div>

        <div className={styled.tile}>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <div className={styled.tileTitle}>Open ASA</div>
              <div className={styled.tileNumber}>{stats.openMessages ?? '-'}</div>
            </div>
            <div className={styled.icon}>
              <img src={history} alt='openMessage' className={styled.iconImage} />
            </div>
          </div>
        </div>

        <div className={styled.tile}>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <div className={styled.tileTitle}>Today's Sales</div>
              <div className={styled.tileNumber}>
                {stats?.sales?.today ? stats?.sales?.today : 0}
              </div>
            </div>
            <div className={styled.icon}>
              <img src={dollar} alt='openMessage' className={styled.iconImage} />
            </div>
          </div>
        </div>
      </div>

      <div className={styled.recipients}>
        <div className={styled.tile}>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <div className={styled.tileTitle}>Online Users Verified / Non Verified</div>
              <div className={styled.tileNumber}>
                {getUsersCount(stats?.onlineUsers, 'VERIFIED')} /{' '}
                {getUsersCount(stats?.onlineUsers, 'UNVERIFIED')}
              </div>
            </div>
            <div className={styled.icon}>
              <img src={user} alt='user' className={styled.iconImage} />
            </div>
          </div>
        </div>

        <div className={styled.tile}>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <div className={styled.tileTitle}>Online Mods</div>
              <div className={styled.tileNumber}>{stats?.onlineMods?.length}</div>
            </div>
            <div className={styled.icon}>
              <img src={mods} alt='mods' className={styled.iconImage} />
            </div>
          </div>
        </div>

        <div className={styled.tile}>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>{console.log( stats?.sales)}
              <div className={styled.tileTitle}>Sales This Month</div>
              <div className={styled.tileNumber}>
                {stats?.sales?.currentMonth ? stats?.sales?.currentMonth : 0}
              </div>
            </div>
            <div className={styled.icon}>
              <img src={dollar} alt='openMessage' className={styled.iconImage} />
            </div>
          </div>
        </div>
      </div>

      <div className={styled.recipients}>
        <div className={styled.tile}>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <div className={styled.tileTitle}>New Customers / Verified {`(Today)`}</div>
              <div className={styled.tileNumber}>
                {getUsersCount(stats?.newVerifiedUsers, 'VERIFIED')} /{' '}
                {getUsersCount(stats?.newVerifiedUsers, 'UNVERIFIED')}
              </div>
            </div>
            <div className={styled.icon}>
              <img src={redUser} alt='redUser' className={styled.iconImage} />
            </div>
          </div>
        </div>

        <div className={styled.tile}>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <div className={styled.tileTitle}>Emails Sent {`(Today)`}</div>
              <div className={styled.tileNumber}>{stats?.emailsSentToday}</div>
            </div>
            <div className={styled.icon}>
              <img src={mail} alt='mail' className={styled.iconImage} />
            </div>
          </div>
        </div>

        <div className={styled.tile}>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <div className={styled.tileTitle}>Sales Last Month</div>
              <div className={styled.tileNumber}>
                {stats?.sales?.lastMonth ? stats?.sales?.lastMonth : 0}
              </div>
            </div>
            <div className={styled.icon}>
              <img src={dollar} alt='openMessage' className={styled.iconImage} />
            </div>
          </div>
        </div>
      </div>

      <div className={styled.card}>
        <p>Online Mods</p>

        <div className={styled.mobileView}>
          <table {...getTableProps()} width='100%' className={styled.tableMainNewsStatic}>
            <thead>
              {headerGroups?.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers?.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      styled={{
                        background: 'aliceblue',
                        color: 'black',
                        fontWeight: '600',
                      }}
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows?.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells?.map((cell) => {
                      return (
                        <td {...cell.getCellProps()} styled={{}}>
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

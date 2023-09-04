import React from 'react';
import styled from './style.module.css';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllQueries } from '../../../../../store/slices/adminAPI/actions';
import { unwrapResult } from '@reduxjs/toolkit';
import { useState } from 'react';
import { useTable } from 'react-table';
import { useMemo } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { updateQuery } from '../../../../../store/slices/userAuth/actions';
import { useMediaQuery } from '@mui/material';
import CloseIcon from '../../../../../assets/images/navClose.png';
import Button from '@mui/material/Button';

const Queries = () => {
  const isMobile = useMediaQuery('(max-width: 786px)');
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? 350 : 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };
  const dispatch = useDispatch();
  const [queries, setQueries] = useState([]);
  const [UpdateQueryModal, setUpdateQueryModal] = useState(false);
  const [specificId, setSpecificId] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const getQueries = () => {
    dispatch(getAllQueries())
      .then(unwrapResult)
      .then((result) => {
        setQueries(result);
      });
  };

  useEffect(() => {
    getQueries();
  }, []);

  const data = useMemo(
    () =>
      queries?.map((data) => {
        return {
          id: data.id,
          userName: data.user?.userName,
          query: data.query,
          status: data.status.replace('_', ' '),
          date: data.createdAt.split('T')[0],
        };
      }),
    [queries],
  );

  const columns = useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'userName',
      },
      {
        Header: 'Query',
        accessor: 'query',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Date',
        accessor: 'date',
      },
    ],
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const handleContactSupport = (e) => {
    e.preventDefault();
    const payload = {
      id: specificId.toString(),
      status: status,
    };

    dispatch(updateQuery(payload))
      .then(unwrapResult)
      .then((result) => {
        if (result) {
          setUpdateQueryModal(false);
          getQueries();
        }
      });
  };

  const getSpecifiQuery = (row) => {
    setStatus(row.original.status);
    setMessage(row.original.query);
    setSpecificId(row.original.id);

    setUpdateQueryModal(true);
  };
  const handleModalClose = () => {
    setUpdateQueryModal(false);
  };
  return (
    <div className={styled.mobileView}>
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
            {queries.length > 0 &&
              rows?.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {}
                    {row.cells?.map((cell) => {
                      if (cell?.column?.id === 'status') {
                        return (
                          <td>
                            <button
                              className={styled.statusButton}
                              {...cell.getCellProps()}
                              styled={{}}
                              onClick={() => getSpecifiQuery(row)}
                              style={{ cursor: 'pointer' }}
                            >
                              {cell.render('Cell')}
                            </button>
                          </td>
                        );
                      }
                      return (
                        <td
                          {...cell.getCellProps()}
                          styled={{}}
                          onClick={() => getSpecifiQuery(row)}
                          style={{ cursor: 'pointer' }}
                        >
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
      {queries.length === 0 && (
        <p style={{ textAlign: 'center', padding: '50px 50px' }}>No Queries to show</p>
      )}

      <Modal
        open={UpdateQueryModal}
        onClose={() => setUpdateQueryModal(false)}
        // id={userListData.id}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Button onClick={handleModalClose} className={styled.closeBtnModal}>
            <img src={CloseIcon} alt='cross icon' />
          </Button>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Update Query
          </Typography>
          <div className={styled.rightContactSupportRight}>
            <div className={styled.rightContactSupportRightR}>
              <form onSubmit={(e) => handleContactSupport(e)}>
                <div className={styled.fromGroup}>
                  <label>Status</label>
                  <select
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                    value={status}
                    className={styled.status}
                  >
                    <option value='all'>All</option>
                    <option value='IN_PROGRESS'>IN PROGRESS</option>
                    <option value='REJECTED'>REJECTED</option>
                    <option value='RESOLVED'>RESOLVED</option>
                  </select>
                </div>
                <div className={styled.formGroup}>
                  <label>Message</label>
                  <textarea
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                    value={message}
                    disabled
                  ></textarea>
                </div>
                <div className={styled.formGroup}>
                  <button>Update</button>
                </div>
              </form>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Queries;

import React, { useCallback } from 'react';
import UserVerified from '../../../assets/images/userVerified.svg';
import UserProfile from '../../../assets/images/userP.jpg';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import styled from './style.module.css';
// import style from './style.module.css';
import { convertLength } from '@mui/material/styles/cssUtils';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { customerListAction } from '../../../store/slices/userAuth/actions';
import { unwrapResult } from '@reduxjs/toolkit';
import CircularProgress from '@mui/material/CircularProgress';
import MaleAvatr from '../../../assets/images/male.png';
import FemaleAvatr from '../../../assets/images/female.png';
import { useUser } from '../../../providers/useUser';

const HomeUserOnline = (props) => {
  // const token =   localStorage.getItem('token')
  const { token } = useUser();

  const [listData, setListData] = useState('');
  const [nextPage, setNextPage] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [pageCount, setPageCount] = useState(listData?.page);
  const [loading, setLoading] = useState(false);
  function calculateAge(birthDateString) {
    var birthDate = new Date(birthDateString);
    var difference = Date.now() - birthDate.getTime();
    var ageDate = new Date(difference);
    var calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    return calculatedAge ? calculatedAge : '';
  }

  const dispatch = useDispatch();

  const fetchUsersList = useCallback(async () => {
    const payload = {
      page: 1,
      pageSize: 8,
      online: true,
      token: token,
    };
    dispatch(customerListAction(payload))
      .then(unwrapResult)
      .then((result) => {
        setIsLoading(false);
        setListData(result.data);
        // setNextPage(result.nextPage)
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsersList();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleShowMorePosts = () => {
    // setNextPage(1 + nextPage) // Get the next page count
    const payload = {
      page: nextPage,
      pageSize: 8,
      token: token,
      online: true,
    };
    if (nextPage !== null) {
      setLoading(true); // Show loading spinner
    }
    dispatch(customerListAction(payload))
      .then(unwrapResult)
      .then((result) => {
        result = result.data;
        const newResults = result.data;
        setNextPage(result.nextPage);
        setListData((prevListData) => ({
          data: [...prevListData.data, ...newResults],
          nextPage: result.nextPage,
        }));
        setPageCount(newResults.nextPage);
        setLoading(false); // Hide loading spinner
      })
      .catch((error) => {
        setLoading(false); // Hide loading spinner
      });
  };
  return (
    <div>
      {isLoading ? (
        <CircularProgress color='secondary' style={{ marginLeft: '50%' }} />
      ) : (
        listData?.data?.map((user) => (
          <div key={user?.id} className={styled.homeUserNewMain}>
            <div className={styled.homeUserNewInner}>
              <div className={styled.userImage}>
                <div className={styled.userImage}>
                  {user?.profile?.avatarUrl === null ? (
                    user?.selfGender === 'MALE' ? (
                      <img src={MaleAvatr} alt='' />
                    ) : (
                      <img src={FemaleAvatr} alt='' />
                    )
                  ) : (
                    <img src={`${user?.profile?.avatarUrl}`} alt='' />
                  )}
                </div>
              </div>
              <div className={styled.homeUserNewDetails}>
                <h3>
                  {user?.userName} , {calculateAge(user?.profile?.dateOfBirth)}
                </h3>
                <h3 style={{ textAlign: 'center' }}>
                  <LocationOnIcon style={{ width: '18px', float: 'left' }} />
                  {user?.address?.address ? user?.address?.address.slice(0, 2) + 'XXX' : `63XXX`}
                </h3>
                <div>
                  {user?.profile?.isProfileVerified === 'VERIFIED' && (
                    <div className={styled.homeUserNewVerified}>
                      <img src={UserVerified} alt='' />
                    </div>
                  )}
                </div>
              </div>
              <div className={styled.homeUserNewOnline}>
                <div className={styled.homeUserNewOnlineIcon}></div>
              </div>
            </div>
          </div>
        ))
      )}
      {nextPage !== null && (
        <button
          className={styled.loadMoreBtn}
          onClick={handleShowMorePosts}
          disabled={nextPage === null}
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};
//.filter(user => user?.online === true)
export default HomeUserOnline;

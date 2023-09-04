import React, { useEffect, useState, useCallback } from 'react';
import UserVerified from '../../../assets/images/userVerified.svg';
import UserProfile from '../../../assets/images/userP.jpg';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link } from 'react-router-dom';
import styled from './style.module.css';
import { useDispatch } from 'react-redux';
import { customerListAction } from '../../../store/slices/userAuth/actions';
import { unwrapResult } from '@reduxjs/toolkit';
import CircularProgress from '@mui/material/CircularProgress';
import MaleAvatr from '../../../assets/images/male.png';
import FemaleAvatr from '../../../assets/images/female.png';
import { useUser } from '../../../providers/useUser';

const HomeUserNew = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  const userPageData = props.listData;
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [pageCount, setPageCount] = useState(userPageData?.page);
  const [usersList, setUsersList] = useState(userPageData?.data);
  const [numResults, setNumResults] = useState(userPageData?.pageSize);
  const [nextPage, setNextPage] = useState(2);
  // const allResults = usersList;

  const dispatch = useDispatch();

  useEffect(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo?.getDate() - 7);
    // const filtered = userList?.filter((usersList) => new Date(userList?.createdAt) > sevenDaysAgo);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsersList();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const fetchUsersList = useCallback(async () => {
    const payload = {
      page: 1,
      pageSize: 8,
      newUsers: true,
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
  function calculateAge(birthDateString) {
    var birthDate = new Date(birthDateString);
    var difference = Date.now() - birthDate.getTime();
    var ageDate = new Date(difference);
    var calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    return calculatedAge ? calculatedAge : '';
  }
  // const token = localStorage.getItem('token')
  const { token } = useUser();

  const handleShowMorePosts = () => {
    // setNextPage(1 + nextPage) // Get the next page count
    const payload = {
      page: nextPage,
      newUsers: true,
      pageSize: numResults,
      token: token,
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
        })); // Concatenate previous results with new results
        setPageCount(newResults.nextPage);
        setLoading(false); // Hide loading spinner
      })
      .catch((error) => {
        setLoading(false); // Hide loading spinner
      });
  };
  return (
    <div>
      <div className={styled.homeUserNewMain}>
        {isLoading ? (
          <CircularProgress color='secondary' style={{ marginLeft: '50%' }} />
        ) : (
          <>
            {listData?.data?.map((userDataModal) => (
              <div className={styled.homeUserNewInner}>
                <Link to={`/profile/${userDataModal?.id}`}>
                  <div className={styled.userImage}>
                    {userDataModal?.profile?.avatarUrl === null ? (
                      userDataModal?.selfGender === 'Male' ? (
                        <img src={MaleAvatr} alt='' />
                      ) : (
                        <img src={FemaleAvatr} alt='' />
                      )
                    ) : (
                      <img src={`${userDataModal?.profile?.avatarUrl}`} alt='' />
                    )}
                  </div>
                  <div className={styled.homeUserNewDetails}>
                    <h3>
                      {userDataModal?.userName} , {calculateAge(userDataModal?.profile?.dateOfBirth)}
                    </h3>
                    <h3>
                      <LocationOnIcon style={{ width: '18px', float: 'left' }} />
                      {userDataModal?.address?.address
                        ? userDataModal?.address?.address.slice(0, 2) + 'XXX'
                        : `63XXX`}
                    </h3>

                    {userDataModal?.profile?.isProfileVerified === 'VERIFIED' && (
                      <div className={styled.homeUserNewVerified}>
                        <img src={UserVerified} alt='' />
                      </div>
                    )}
                  </div>

                  <div className={styled.homeUserNewOnline}>
                    <div
                      className={
                        userDataModal?.online
                          ? styled.homeUserNewOnlineIcon
                          : styled.homeUserNewOfflineIcon
                      }
                    ></div>
                  </div>
                </Link>
              </div>
            ))}
          </>
        )}
        {nextPage !== null && (
          <button
            className={styled.loadmoreBtn}
            onClick={handleShowMorePosts}
            disabled={nextPage === null}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )}
        {/* )} */}
        {/* <button onClick={handleShowMorePosts}>Load more</button> */}
      </div>
    </div>
  );
};

export default HomeUserNew;

import React, { Fragment, useState, useCallback, useEffect } from 'react';
import styled from './style.module.css';
import ProfileLock18 from '../../../assets/images/profileLock18.svg';
import UserVerified from '../../../assets/images/userVerified.svg';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link } from 'react-router-dom';
import { customerListAction } from '../../../store/slices/userAuth/actions';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import MaleAvatr from '../../../assets/images/male.png';
import FemaleAvatr from '../../../assets/images/female.png';
import { useUser } from '../../../providers/useUser';

const HomeUserFSK = (props) => {
  const { token } = useUser();

  const userPageData = props.listData;
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [nextPage, setNextPage] = useState(2);

  const [pageCount, setPageCount] = useState(userPageData?.page);
  const [usersList, setUsersList] = useState(userPageData?.data);
  const [numResults, setNumResults] = useState(userPageData?.pageSize);
  const [listData, setListData] = useState('');
  const allResults = usersList;

  const dispatch = useDispatch();
  function calculateAge(birthDateString) {
    var birthDate = new Date(birthDateString);
    var difference = Date.now() - birthDate.getTime();
    var ageDate = new Date(difference);
    var calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    return calculatedAge ? calculatedAge : '';
  }
  // filter all verfied users
  //map
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
      fsk: true,
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
  const handleShowMorePosts = () => {
    const payload = {
      page: 8,
      pageSize: numResults,
      token: token,
      fsk: true,
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
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  return (
    <Fragment>
      <div className={styled.ProfileVisitmain}>
        {isLoading ? (
          <CircularProgress color='secondary' style={{ marginLeft: '50%' }} />
        ) : (
          listData?.data?.map(
            (userDataModal) =>
              userDataModal?.status === 'VERIFIED' && (
                <>
                  <Link to={`/profile/${userDataModal?.id}`}>
                    <div className={styled.ProfileVisitInner}>
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
                          {userDataModal?.userName} ,{' '}
                          {calculateAge(userDataModal?.profile?.dateOfBirth)}
                        </h3>
                        <h3>
                          <LocationOnIcon style={{ width: '18px', float: 'left' }} />
                          {userDataModal?.address?.address
                            ? userDataModal?.address?.address.slice(0, 2) + 'XXX'
                            : `63XXX`}
                        </h3>
                        <div>
                          {userDataModal?.profile?.isProfileVerified === 'VERIFIED' && (
                            <div className={styled.homeUserNewVerified}>
                              <img src={UserVerified} alt='' />
                            </div>
                          )}
                        </div>
                      </div>
                      {/* <div className={styled.lockProfile}>
                      <img src={ProfileLock18} alt='' className={styled.ProfileLock18} />
                      <p>110 coins</p>
                      {userDataModal?.profile?.isProfileVerified === 'VERIFIED' && (
                        <div className={styled.homeUserNewVerified}>
                          <img src={UserVerified} alt='' />
                        </div>
                      )}
                    </div> */}
                      <div className={styled.homeUserNewOnline}>
                        <div
                          className={
                            userDataModal?.online
                              ? styled.homeUserNewOnlineIcon
                              : styled.homeUserNewOfflineIcon
                          }
                        ></div>
                      </div>
                    </div>
                  </Link>
                </>
              ),
          )
        )}
        {nextPage !== null && (
          <button
            className={styled.loadmoreBtn}
            onClick={handleShowMorePosts}
            disabled={nextPage === null}
          >
            {loading ? 'Loading...' : 'Load More'}
            {/* <div className={styled.clear}></div>    */}
          </button>
        )}
      </div>
    </Fragment>
  );
};

export default HomeUserFSK;

import React, { Fragment, useState, useEffect } from 'react';
import styled from './style.module.css';
import UserVerified from '../../../assets/images/userVerified.svg';
import ProfileLock18 from '../../../assets/images/profileLock18.svg';
import { Link } from 'react-router-dom';
import { getRandomUser } from '../../../store/slices/customerAPI/action';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useUser } from '../../../providers/useUser';

const HomeRandomUsers = () => {
  // const { successMessage } = useSelector((state) => state.customerAPISlice);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const { token } = useUser();

  const payload = {
    token: token,
  };
  useEffect(() => {
    const fetcRandomUser = () => {
      dispatch(getRandomUser(payload))
        .then(unwrapResult)
        .then((result) => {
          setUsersList(result);
        })
        .catch((error) => {
          setLoading(false);
        });
    };
    fetcRandomUser();
  }, []);

  function calculateAge(birthDateString) {
    var birthDate = new Date(birthDateString);
    var difference = Date.now() - birthDate.getTime();
    var ageDate = new Date(difference);
    var calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    return calculatedAge;
  }

  return (
    <Fragment>
      <div className={styled.ProfileVisitmain}>
        <div className={styled.ProfileVisitmain}>
          <Link to={`/profile/${usersList?.id}`}>
            <div className={styled.ProfileVisitInner}>
              <div className={styled.userImage}>
                <img src={`${usersList?.profile}`} alt='' />
              </div>
              <div className={styled.lockProfile}>
                <img src={ProfileLock18} alt='' className={styled.ProfileLock18} />
                <p>110 coins</p>
              </div>
              <div className={styled.homeUserNewOnline}>
                <div className={styled.homeUserNewOnlineIcon}></div>
              </div>
              <div className={styled.homeUserNewVerified}>
                <img src={UserVerified} alt='' />
              </div>
            </div>
          </Link>
        </div>

        <div className={styled.clear}></div>
        {/* <button className={styled.loadmoreBtn} onClick={handleShowMorePosts}>
            {loading ? 'Loading...' : 'Load More'}
          </button> */}
      </div>
    </Fragment>
  );
};

export default HomeRandomUsers;

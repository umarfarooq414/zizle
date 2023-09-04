import { unwrapResult } from '@reduxjs/toolkit';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import UserFavourtiesIcon from '../../../assets/images/favourties_icon.svg';
import { favouriteUsersList } from '../../../store/slices/customerAPI/action';
import MaleAvatr from '../../../assets/images/male.png';
import FemaleAvatr from '../../../assets/images/female.png';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
  userCoinCostAction,
  userCointransactionAction,
} from '../../../store/slices/userAuth/actions';
import styled from './style.module.css';
import { useUser } from '../../../providers/useUser';
import DarkModeContext from '../../../providers/DarkModeContext';
const UserFavourites = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  let navigate = useNavigate();

  const [listData, setListData] = useState([]);
  const [coinData, setCoinData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [listFavUser, setListFavUser] = useState();
  const favouritesListFetched = useRef(false);

  const dispatch = useDispatch();
  const { token, blockedUser } = useUser();

  const handleUnlock = (id) => {
    const payload = {
      actionType: 'VIEWPHOTO',
    };
    dispatch(userCointransactionAction(payload))
      .then(unwrapResult)
      .then((result) => {
        if (result.data.success) {
          navigate(`/profile/${id}`);
        } else {
          setShowPopup(true);
        }
      })
      .catch((error) => { });
  };
  const favProfileList = () => {
    const payload = {
      token,
    };
    dispatch(favouriteUsersList(payload))
      .then(unwrapResult)
      .then((result) => {
        setListData(result);
        for (let i = 0; i < result.data.length; i++) {
          const favUser = result.data[i];
          setListFavUser(favUser);
        }
      })
      .catch((error) => { });
    dispatch(userCoinCostAction())
      .then(unwrapResult)
      .then((result) => {
        setCoinData(result);
      })
      .catch((error) => { });
  };

  useEffect(() => {
    if (favouritesListFetched.current) return;
    favouritesListFetched.current = true;
    favProfileList();
  }, []);

  function calculateAge(birthDateString) {
    var birthDate = new Date(birthDateString);
    var difference = Date.now() - birthDate.getTime();
    var ageDate = new Date(difference);
    var calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    return calculatedAge ? calculatedAge : '';
  }



  const filteredData = listData?.filter((listVisitedData) => {
    const blocked = blockedUser?.find((blockedUser) => blockedUser?.blocked?.id === listVisitedData?.favorites?.id);
    return blocked === undefined;
  });
  return (
    <Fragment>
      <div className={styled.ProfileVisitmain}>
        <div className={styled.textContent}>
          <h3>Favourites members</h3>
        </div>
        {filteredData?.length === 0 ? (
          <div style={{ textAlign: "center" }} className={styled.ProfileVisitMessage}>
            <img src={UserFavourtiesIcon} alt='a' />
            <p>Creepy, there&apos;s nothing here.</p>
          </div>
        ) : (
          filteredData?.map((listVisitedData) => (
            <div className={styled.homeUserNewInner}>
              <Link to={`/profile/${listVisitedData?.favorites?.id}`}>
                <div className={styled.ProfileVisitInner}>
                  <div className={styled.userImage}>
                    {!listVisitedData?.favorites?.profile?.avatarUrl ? (
                      listVisitedData?.favorites?.selfGender === 'Male' ? (
                        <img src={MaleAvatr} alt='' style={{ filter: 'blur(0)' }} />
                      ) : (
                        <img src={FemaleAvatr} alt='' style={{ filter: 'blur(0)' }} />
                      )
                    ) : (
                      <img src={`${listVisitedData?.favorites?.profile?.avatarUrl}`} alt='' style={{ filter: 'blur(0)' }} />
                    )}

                    {/* <img
                      src={listVisitedData?.favorites?.profile?.avatarUrl}
                      alt=''
                      style={{ filter: 'blur(0)' }}
                    /> */}
                  </div>
                  <div className={styled.homeUserNewDetails}>
                    <h3>
                      {listVisitedData?.favorites?.userName}{' '}
                      <span>{calculateAge(listVisitedData?.favorites?.profile?.dateOfBirth)}</span>
                    </h3>
                    {/* <h3>
                      {listVisitedData?.userName} , {calculateAge(listVisitedData?.profile?.dateOfBirth)}
                    </h3> */}
                    <h3>
                      <LocationOnIcon style={{ color: isDarkMode ? '#fff' : '#000', width: '18px', float: 'left' }} />
                      {listVisitedData?.favorites?.address?.address
                        ? listVisitedData?.favorites?.address?.address.slice(0, 2) + 'XXX'
                        : `63XXX`}
                    </h3>
                    {/* {/* <button
                      // onClick={() => handleUnlock(listVisitedData?.favorites?.id)}
                      // className={styled.unlockbtn}
                    >
                      {/* <h3>UNLOCK</h3> */}
                    {/* </button> */}
                  </div>{' '}
                </div>
              </Link>
            </div>
          ))
        )}
        <div className={styled.clear}></div>
      </div>
    </Fragment>
  );
};

export default UserFavourites;

import React, { useEffect, useState, useCallback } from 'react';
import MaleAvatr from '../../../../../assets/images/male.png';
import FemaleAvatr from '../../../../../assets/images/female.png';
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
  fakeUserListAction,
  fakeEditAccessAction,
  fakeDeleteAccessAction,
} from '../../../../../store/slices/userAuth/actions';
import { CircularProgress, useMediaQuery } from '@material-ui/core';

import CloseIcon from '../../../../../assets/images/navClose.png';
import ActionIcon from '../../../../../assets/images/settings.png';
import { style } from '@mui/system';

const mainHeading = {
  marginBottom: '10px',
};

const germanyPostcalCodes = [
  60308, 80331, 49326, 49377, 49477, 49479, 83317, 83707, 83677, 83278, 83533, 83626, 83569, 83483,
  83627, 35066, 35625, 35305, 35094, 35767, 35325, 35108, 35390, 35435, 25992, 66793, 48356, 48308,
  48341, 48282, 48429, 96224, 96164, 96166, 96155, 96170, 96317, 96179, 96231, 53489, 53501, 53937,
  53894, 53913, 53881, 53474, 53557, 53639, 66787, 66763, 14979,
];

const FakeUser = () => {
  const isMobile = useMediaQuery('(max-width: 786px)');
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? 350 : 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
  };
  const imagePreviewStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    padding: 0,
    height: 'auto',
    width: isMobile ? 'auto' : 'auto',
  };
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [relation, setRelation] = useState('');
  const [children, setChildren] = useState('');
  const [life, setLife] = useState('');
  const [smoker, setSmoker] = useState('');
  const [gender, setGender] = useState('');
  const [interestedGender, setInterestedGender] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [profileText, setProfileText] = useState('');
  const [photos, setPhotos] = useState(``);
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState(``);
  const [photosPreviews, setPhotosPreviews] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedRow, setSelectedRow] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const handleOpen = (
    id,
    avatar,
    photos,
    name,
    email,
    dob,
    postalcode,
    relation,
    children,
    life,
    smoker,
    gender,
    interestedGender,
    profileText,
    mobileNumber,
  ) => {
    setId(id);
    const currentUser = listData.find((user) => user.id === id);
    setUser(currentUser);
    // setAvatar(avatar);
    setAvatarPreview(avatar);
    // setPhotos(photos);
    setPhotosPreviews(photos);
    setName(name);
    setEmail(email);
    setDob(adjustTimezoneOffset(dob));
    setPostalCode(postalcode);
    setRelation(relation);
    setChildren(children);
    setLife(life);
    setSmoker(smoker);
    setGender(gender);
    setInterestedGender(interestedGender);
    setProfileText(profileText);
    setMobileNumber(mobileNumber);
    setOpen(true);
    setSelectedRow(id);
  };
  const handleClose = () => {
    setAvatar('');
    setAvatarPreview('');
    setOpen(false);
  };
  const [listData, setListData] = useState('');

  const dispatch = useDispatch();

  const onActionEdit = (e) => {
    e.preventDefault();
    const currentUser = listData.find((user) => user.id === id);
    // setUser(currentUser);
    const payload = new FormData();
    payload.id = id;
    if (avatar) {
      payload.avatar = avatar;
    }

    if (photos?.length > 0) {
      payload.photos = photos;
    }
    if (name?.length && name !== currentUser.userName) {
      payload.userName = name;
    }
    if (email?.length && email !== currentUser.email) {
      payload.email = email;
    }
    if (gender?.length && gender !== currentUser.selfGender) {
      payload.selfGender = gender;
    }

    if (interestedGender?.length && interestedGender !== currentUser.interestedGender) {
      payload.interestedGender = interestedGender;
    }
    if (life?.length && life !== currentUser.profile?.life) {
      payload.life = life;
    }
    if (smoker?.length && smoker !== currentUser.profile?.smoker) {
      payload.smoker = smoker;
    }
    if (relation?.length && relation !== currentUser.profile?.relationshipStatus) {
      payload.relationshipStatus = relation;
    }
    if (children?.length && children !== currentUser.profile?.children) {
      payload.children = children;
    }
    // if (dob && dob !== currentUser.profile?.dateOfBirth) {
    payload.dob = dob;
    // }
    if (postalCode && postalCode !== currentUser?.address?.address) {
      payload.postalCode = postalCode;
    }
    if (mobileNumber && mobileNumber !== currentUser.profile?.mobileNumber) {
      payload.mobileNumber = mobileNumber;
    }
    if (profileText?.length && profileText !== currentUser.profile?.profileText) {
      payload.profileText = profileText;
    }
    setIsLoading(true);
    dispatch(fakeEditAccessAction(payload))
      .then(unwrapResult)
      .then((result) => {
        fetchUsersList();
        setOpen(false);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const onActionDelete = (id) => {
    const payload = {
      id: id,
    };
    dispatch(fakeDeleteAccessAction(payload))
      .then(unwrapResult)
      .then((result) => {
        fetchUsersList();
      })
      .catch((error) => { });
  };

  const fetchUsersList = useCallback(async () => {
    dispatch(fakeUserListAction())
      .then(unwrapResult)
      .then((result) => {
        setListData(result.data);
      })
      .catch((error) => { });
  }, []);

  useEffect(() => {
    fetchUsersList();
  }, [fetchUsersList]);

  const handleSingleUploadClick = (e) => {
    e.preventDefault();
    document.querySelector('.file_upload').click();
  };

  function handleMultipleChange(e) {
    const selectedFiles = Array.from(e.target.files);
    const previews = [];

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push({
          id: photosPreviews[photosPreviews.length - 1]?.id + 1,
          photos: e.target.result,
        });
        if (previews.length === selectedFiles.length) {
          setPhotosPreviews([...photosPreviews, ...previews]);
          setPhotos([...photos, ...selectedFiles]);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  const handleMultiUploadClick = (e) => {
    e.preventDefault();
    document.querySelector('.multiple_upload').click();
  };

  function removeSelectedPhoto(indexToRemove) {
    setPhotosPreviews((prevPreviews) => prevPreviews.filter((_, index) => index !== indexToRemove));
  }
  function handleAvatarChange(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };

      setAvatar(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function generatePostalCode() {
    const randomPostalCode =
      germanyPostcalCodes[Math.floor(Math.random() * germanyPostcalCodes.length)];
    setPostalCode(randomPostalCode);
  }
  function adjustTimezoneOffset(dateString) {
    const date = new Date(dateString);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() - timezoneOffset);
    return adjustedDate.toISOString().slice(0, 10);
  }

  const openImageModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setImageModalOpen(false);
  };
  return (
    <div>
      <Typography variant='h6' sx={mainHeading}>
        Dashboard {'>'} Fake User
      </Typography>
      <div className={styled.mobileView}>
        <table width='100%' className={styled.allFakeUser}>
          <tr>
            <th>Avatar</th>
            <th>Username</th>
            <th>Email</th>
            <th>Date of birth</th>
            <th>Postal code</th>
            <th>Relationship Status</th>
            <th>Children</th>
            <th>Life</th>
            <th>Smoker</th>
            <th>Action</th>
          </tr>
          {listData && (
            <>
              {listData?.map((userListData) => (
                <>
                  <tr>
                    <td>
                      {/* <div style={{backgroundImage: `url(${userListData.avatarUrl})`, width: "100px", height: "100px"}}></div> */}
                      {!userListData?.profile?.avatarUrl ? (
                        userListData?.selfGender === 'MALE' ? (
                          <img
                            src={MaleAvatr}
                            alt={'No image'}
                            onClick={() => openImageModal(MaleAvatr)}
                          />
                        ) : (
                          <img
                            src={FemaleAvatr}
                            alt={'No image'}
                            onClick={() => openImageModal(FemaleAvatr)}
                          />
                        )
                      ) : (
                        <img
                          src={`${userListData?.profile?.avatarUrl}`}
                          onClick={() => openImageModal(`${userListData?.profile?.avatarUrl}`)}
                          alt={'No image'}
                        />
                      )}

                      {/* <img src={`${userListData?.profile?.avatarUrl}`}
                        onClick={() => openImageModal(`${userListData?.profile?.avatarUrl}`)}
                        alt={'No image'}
                      /> */}
                    </td>
                    <td>{userListData?.userName}</td>
                    <td>{userListData?.email}</td>
                    <td>{userListData?.profile?.dateOfBirth.split('T')[0]}</td>
                    <td>{userListData?.address?.address}</td>
                    <td>{userListData?.profile?.relationshipStatus}</td>
                    <td>{userListData?.profile?.children}</td>
                    <td>{userListData?.profile?.life}</td>
                    <td>{userListData?.profile?.smoker}</td>
                    <td>
                      <Button onClick={() => onActionDelete(userListData.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                      <Button
                        onClick={() =>
                          handleOpen(
                            userListData?.id,
                            userListData?.profile?.avatarUrl
                              ? userListData?.profile?.avatarUrl
                              : userListData?.selfGender === 'MALE'
                                ? MaleAvatr
                                : FemaleAvatr,
                            userListData?.photos,
                            userListData?.userName,
                            userListData?.email,
                            userListData?.profile?.dateOfBirth,
                            userListData?.address?.address,
                            userListData?.profile?.relationshipStatus,
                            userListData?.profile?.children,
                            userListData?.profile?.life,
                            userListData?.profile?.smoker,
                            userListData?.selfGender,
                            userListData?.interestedGender,
                            userListData?.profile?.profileText,
                            userListData?.profile?.mobileNumber,
                          )
                        }
                      >
                        {/* <FontAwesomeIcon icon={faEye} /> */}
                        <img
                          style={{
                            height: '20px',
                            width: '20px',
                            filter:
                              'invert(33%) sepia(96%) saturate(1029%) hue-rotate(183deg) brightness(96%) contrast(89%)',
                          }}
                          src={ActionIcon}
                        />
                      </Button>


                    </td>
                  </tr>
                </>
              ))}

              <Modal
                keepMounted
                open={open}
                id={selectedRow}
                onClose={handleClose}
                aria-labelledby='keep-mounted-modal-title'
                aria-describedby='keep-mounted-modal-description'
              >
                <Box sx={style}>
                  <Button onClick={handleClose} className={styled.closeBtnModal}>
                    <img src={CloseIcon} alt='cross icon' />
                  </Button>
                  <Typography
                    id='keep-mounted-modal-title'
                    variant='h6'
                    component='h2'
                    style={{ padding: '10px 20px', boxShadow: '0px 0px 7px rgba(0,0,0,0.5)' }}
                  >
                    Update User
                  </Typography>
                  <div className={styled.createFakeUser}>
                    <form>
                      {/* <div className={`${styled.fromGroup} ${styled.fromGroupFull}`}>
                              <label>Avatar</label>
                              <input
                                type='file'
                                name='file'
                              />
                            </div> */}
                      <div className={`${styled.fromGroup} ${styled.fromGroupFull}`}>
                        <input
                          type='file'
                          className='file_upload'
                          onChange={(e) => {
                            handleAvatarChange(e);
                          }}
                          style={{ display: 'none' }}
                          // multiple
                          accept='image/*'
                        />

                        {avatarPreview ? (
                          <div className={styled.avatar}>
                            <img
                              src={
                                avatarPreview
                                  ? avatarPreview
                                  : 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'
                              }
                              alt='Profile Picture'
                              className={styled.profile_pic}
                            />
                          </div>
                        ) : (
                          <img
                            src={avatarPreview}
                            alt='Profile Picture'
                            className={styled.profile_pic}
                          />
                        )}

                        <button
                          className={styled.multipleUploadButton}
                          onClick={handleSingleUploadClick}
                        >
                          Avatar
                        </button>
                      </div>

                      <div className={`${styled.fromGroup} ${styled.fromGroupFull}`}>
                        <div className={styled.clear}>
                          <input
                            type='file'
                            className='multiple_upload'
                            onChange={(e) => {
                              handleMultipleChange(e);
                            }}
                            style={{ display: 'none' }}
                            multiple
                            accept='image/*'
                          />
                          {/* Render new photos */}
                          {photosPreviews?.map((preview, index) => (
                            <div className={styled.multiImages} key={`new-${index}`}>
                              <img
                                src={preview.photos}
                                alt={`Profile Picture ${index + 1}`}
                                className={styled.multipleProfile}
                                style={{
                                  width: '100px',
                                  height: '100px',
                                  marginRight: '10px',
                                }}
                              />
                              <button
                                className={styled.crossButton}
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeSelectedPhoto(index);
                                }}
                              >
                                X
                              </button>
                            </div>
                          ))}

                          <button
                            className={styled.multipleUploadButton}
                            onClick={handleMultiUploadClick}
                          >
                            Upload photos
                          </button>
                        </div>
                      </div>
                      <div className={`${styled.fromGroup} ${styled.fromGroupHalf}`}>
                        <label>Username</label>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          type='text'
                          name='username'
                        />
                      </div>
                      <div className={`${styled.fromGroup} ${styled.fromGroupHalf}`}>
                        <label>Email</label>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type='email'
                          name='email'
                        />
                      </div>
                      <div className={`${styled.fromGroup} ${styled.fromGroupFull}`}>
                        <label style={{ fontSize: '16px' }}>Profile text</label>
                        <textarea
                          name='profile-text'
                          id='profile-text'
                          cols='84'
                          rows='5'
                          value={profileText}
                          onChange={(e) => {
                            setProfileText(e.target.value);
                          }}
                        ></textarea>
                      </div>
                      <div className={`${styled.fromGroup} ${styled.fromGroupHalf}`}>
                        <label>Date of Birth</label>
                        <input
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          type='date'
                          max='2004-12-30'
                          name='dob'
                        />
                      </div>
                      <div className={`${styled.fromGroup} ${styled.fromGroupHalf}`}>
                        <label>Postal Code</label>
                        <input
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          type='text'
                          name='postalcode'
                        />
                        <span onClick={() => generatePostalCode()}>Generate</span>
                      </div>
                      <div className={`${styled.fromGroup} ${styled.fromGroupHalf}`}>
                        <label>Gender</label>
                        <select onChange={(e) => setGender(e.target.value)}>
                          <option value='' selected disabled hidden>
                            {user?.selfGender ? user?.selfGender : '---'}
                          </option>
                          <option value='MALE'>Male</option>
                          <option value='FEMALE'>Female</option>
                          <option value='OTHERS'>Others</option>
                        </select>
                      </div>
                      <div className={`${styled.fromGroup} ${styled.fromGroupHalf}`}>
                        <label>Interested In</label>
                        <select
                          // value={interestedGender}
                          onChange={(e) => setInterestedGender(e.target.value)}
                        >
                          <option value='' selected disabled hidden>
                            {user?.interestedGender ? user?.interestedGender : '---'}
                          </option>
                          <option value='MALE'>Male</option>
                          <option value='FEMALE'>Female</option>
                          <option value='OTHERS'>Others</option>
                        </select>
                      </div>
                      <div className={`${styled.fromGroup} ${styled.fromGroupHalf}`}>
                        <label>Mobile Number</label>
                        <input
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          type='text'
                          name='mobileNumber'
                        />
                      </div>
                      <div className={`${styled.fromGroup} ${styled.fromGroupHalf}`}>
                        <label>Relationship Status</label>
                        <select
                          // value={relation}
                          onChange={(e) => setRelation(e.target.value)}
                        >
                          <option value='' selected disabled hidden>
                            {user?.profile?.relationshipStatus
                              ? user?.profile?.relationshipStatus
                              : '---'}
                          </option>
                          <option value='SINGLE'>Single</option>
                          <option value='IN_A_RELATIONSHIP'>In a Relationship</option>
                          <option value='MARRIED'>Married</option>
                          <option value='WIDOWED'>Widowed</option>
                          <option value='DIVORCED'>Divorced</option>
                          <option value='OPEN_RELATION'>Open Relationship</option>
                          <option value="IT'S_COMPLICATED">It&apos;s complicated</option>
                        </select>
                      </div>
                      <div className={`${styled.fromGroup} ${styled.fromGroupHalf}`}>
                        <label>Children</label>
                        <select
                          // value={children}
                          onChange={(e) => setChildren(e.target.value)}
                        >
                          <option value='' selected disabled hidden>
                            {user?.profile?.children ? user?.profile?.children : '---'}
                          </option>
                          <option value='YES'>Yes</option>
                          <option value='NO'>No</option>
                        </select>
                      </div>
                      <div className={`${styled.fromGroup} ${styled.fromGroupHalf}`}>
                        <label>Life</label>
                        <select onChange={(e) => setLife(e.target.value)}>
                          <option value='' selected disabled hidden>
                            {user?.profile?.life ? user?.profile?.life : '---'}
                          </option>
                          <option value='ALONE'>Alone</option>
                          <option value='AT_PARENTS'>At parents</option>
                          <option value='FLAT_SHARE'>Flat Share</option>
                          <option value='WITH_PARTNER'>With partner</option>
                          <option value='MISCELLANEOUS'>Miscellaneous</option>
                        </select>
                      </div>
                      <div className={`${styled.fromGroup} ${styled.fromGroupHalf}`}>
                        <label>Smoker</label>
                        <select onChange={(e) => setSmoker(e.target.value)}>
                          <option value='' selected disabled hidden>
                            {user?.profile?.smoker ? user?.profile?.smoker : '---'}
                          </option>
                          <option value='YES'>Yes</option>
                          <option value='NO'>No</option>
                          {/* <option value='STOPPED'>Stopped</option> */}
                          <option value='OCCASIONALLY'>Occasionally</option>
                        </select>
                      </div>
                      <div className={`${styled.fromGroup} ${styled.fromGroupFull}`}>
                        <button className={styled.multipleUploadButton} onClick={onActionEdit}>
                          Submit
                          {isLoading && (
                            <CircularProgress
                              color='secondary'
                              size={20}
                              style={{ marginLeft: '25px' }}
                            />
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </Box>
              </Modal>
              <Modal open={isImageModalOpen}>
                <Box sx={imagePreviewStyle}>
                  <Button onClick={closeImageModal} className={styled.imagePreviewCloseBtnModal}>
                    <img src={CloseIcon} alt='cross icon' />
                  </Button>
                  <img src={selectedImage} style={{ height: '100%', maxWidth: '350px' }} />
                </Box>
              </Modal>
            </>
          )}
        </table>
      </div>
    </div>
  );
};

export default FakeUser;

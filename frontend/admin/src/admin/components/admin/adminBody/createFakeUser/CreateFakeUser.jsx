import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import styled from './style.module.css';
import { resigterFakeUserAction } from '../../../../../store/slices/fakeUser/actions';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { Button, CircularProgress, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CloseIcon from '../../../../../assets/images/navClose.png';
import { ClassNames } from '@emotion/react';
import { createDynamicFakesAction } from '../../../../../store/slices/userAuth/actions';
import { useUser } from '../../../../../providers/useUser';
const mainHeading = {
  marginBottom: '10px',
};

const germanyPostcalCodes = [
  60308, 80331, 49326, 49377, 49477, 49479, 83317, 83707, 83677, 83278, 83533, 83626, 83569, 83483,
  83627, 35066, 35625, 35305, 35094, 35767, 35325, 35108, 35390, 35435, 25992, 66793, 48356, 48308,
  48341, 48282, 48429, 96224, 96164, 96166, 96155, 96170, 96317, 96179, 96231, 53489, 53501, 53937,
  53894, 53913, 53881, 53474, 53557, 53639, 66787, 66763, 14979,
];

const style = {
  position: 'absolute',
  top: '22%',
  left: '0',
  right: '0',
  height: 'auto',
  maxWidth: 360,
  // background: '0px 0px 10px rgba(0, 0, 0, 0.4)',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.12);',
  pt: 2,
  px: 4,
  py: 4,
  margin: 'auto',
  background: '#fff',
  borderRadius: '0.75rem',
};

const CreateFakeUser = () => {
  const [formData, setFormData] = useState({
    avatar: '',
    username: '',
    email: '',
    dob: '',
    postalcode: '',
    profileText: '',
    mobileNumber: '',
  });
  const loadingSpinner = useSelector((state) => state?.userAuth?.isLoading);
  const [startAge, setStartAge] = useState(18);
  const [endAge, setEndAge] = useState(30);
  const [selectedGender, setSelectedGender] = useState('Male');
  const [relationship, setRelationship] = useState('SINGLE');
  const [mobileNumber, setMobileNumber] = useState('');
  const [childern, setChildren] = useState('Yes');
  const [gender, setGender] = useState('Male');
  const [life, setLife] = useState('ALONE');
  const [smoker, setSmoker] = useState('YES');
  const [fileUpload, setFileUpload] = useState();
  const [avatar, setAvatar] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [photosPreviews, setPhotosPreviews] = useState([]);
  const [photosFiles, setPhotosFiles] = useState([]);
  const [isFormModified, setIsFormModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const updateFormData = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const dispatch = useDispatch();
  const { token, loggedInUser } = useUser();

  const user = loggedInUser;
  const { username, email, dob, postalcode } = formData;
  const payload = {
    userName: formData?.username,
    profileText: formData?.profileText,
    avatar: avatar,
    photos: photosFiles,
    creator: user?.id,
    role: 'FAKE',
    selfGender: gender,
    interestedGender: gender === 'Male' ? 'Female' : 'Male',
    relationshipStatus: relationship,
    life,
    smoker,
    children: childern,
    mobileNumber: mobileNumber,
    dob: formData?.dob,
    postalCode: postalcode,
    email: email,
  };

  const handleChange = (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(resigterFakeUserAction(payload))
      .then(unwrapResult)
      .then((result) => {
        setIsLoading(false);
        setFormData({
          avatar: '',
          username: '',
          email: '',
          dob: '',
          postalcode: '',
          profileText: '',
          mobileNumber: '',
        });
        setAvatar(null);
        setPhotosFiles([]);
        setGender(`Male`);
        setRelationship('SINGLE');
        setLife('ALONE');
        setSmoker('YES');
        setChildren('Yes');
        setMobileNumber('');
        setPhotosPreviews([]);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  function removeSelectedPhoto(indexToRemove) {
    setPhotosPreviews((prevPreviews) => prevPreviews.filter((_, index) => index !== indexToRemove));
  }

  const handleSingleUploadClick = (e) => {
    e.preventDefault();
    document.querySelector('.file_upload').click();
  };

  const handleMultiUploadClick = (e) => {
    e.preventDefault();
    document.querySelector('.multiple_upload').click();
  };

  function handleMultipleChange(e) {
    const selectedFiles = Array.from(e.target.files);
    const previews = [];

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target.result);
        if (previews.length === selectedFiles.length) {
          setPhotosPreviews([...photosPreviews, ...previews]);
          setPhotosFiles([...photosFiles, ...selectedFiles]);
        }
      };
      reader.readAsDataURL(file);
    });
  }
  function handleAvatarChange(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };

      setAvatar(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function generatePostalCode() {
    const randomPostalCode =
      germanyPostcalCodes[Math.floor(Math.random() * germanyPostcalCodes.length)];
    setFormData({ ...formData, postalcode: randomPostalCode });
  }

  const firstHandleOpen = () => {
    setOpen(true);
  };
  const firstHandleClose = () => {
    setOpen(false);
  };

  const handleCreateDynamicUsers = () => {
    const payload = {
      startAge: startAge,
      endAge: endAge,
      gender: selectedGender,
    };
    dispatch(createDynamicFakesAction(payload));
  };
  return (
    <>
      <div>
        <Typography variant='h6' sx={mainHeading}>
          Dashboard {'>'} Create Fake User
        </Typography>

        <div className={styled.createFakeUser}>
          <form enctype='multipart/form-data'>
            <div className={`${styled.fromGroup} ${styled.fromGroupFull}`}>
              <input
                type='file'
                className='file_upload'
                onChange={(e) => {
                  handleAvatarChange(e);
                  setIsFormModified(true);
                }}
                style={{ display: 'none' }}
                // multiple
                accept='image/*'
              />

              {avatar ? (
                <div className={styled.avatar}>
                  <img
                    src={
                      filePreview
                        ? filePreview
                        : 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'
                    }
                    alt='Profile Picture'
                    className={styled.profile_pic}
                  />
                </div>
              ) : (
                <img src={`${avatar}`} alt='Profile Picture' className={styled.profile_pic} />
              )}

              <button className={styled.multipleUploadButton} onClick={handleSingleUploadClick}>
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
                    setIsFormModified(true);
                  }}
                  style={{ display: 'none' }}
                  multiple
                  accept='image/*'
                />
                {/* Render new photos */}
                {photosPreviews.map((preview, index) => (
                  <div className={styled.multiImages} key={`new-${index}`}>
                    <img
                      src={preview}
                      alt={`Profile Picture ${index + 1}`}
                      className={styled.multipleProfile}
                      style={{ width: '100px', height: '100px', marginRight: '10px' }}
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

                <button className={styled.multipleUploadButton} onClick={handleMultiUploadClick}>
                  Upload photos
                </button>
              </div>

              <Button sx={{
                backgroundColor: '#fd612e',
                border: '1px solid #cbcbcb',
                borderRadius: '40px',
                color: 'white',
                padding: '8px 15px !important',
                fontSize: '14px',
                // marginLeft: "auto",
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#cbcbcb',
                },
              }} onClick={firstHandleOpen}>
                Create Multiple users
              </Button>
              {/* <button className={styled.multipleUploadButton} onClick={firstHandleOpen}>Create Multiple users</button> */}
            </div>
            <div className={`${styled.fromGroup} ${styled.fromGroupFull}`}>
              <label style={{ fontSize: '16px' }}>Profile text</label>
              <textarea
                name='profile-text'
                id='profile-text'
                cols='33'
                rows='5'
                value={formData?.profileText}
                onChange={(e) => {
                  setFormData({ ...formData, profileText: e.target.value });
                  setIsFormModified(true);
                }}
              ></textarea>
            </div>
            <div className={`${styled.fromGroup} ${styled.fromGroupHalf}`}>
              <label>Username</label>
              <input
                type='text'
                name='username'
                value={username}
                onChange={(e) => updateFormData(e)}
              />
            </div>
            <div className={`${styled.fromGroup} ${styled.fromGroupHalf}`}>
              <label>Email</label>
              <input type='email' name='email' value={email} onChange={(e) => updateFormData(e)} />
            </div>
            <div className={`${styled.fromGroup} ${styled.fromGroupHalf}`}>
              <label>Date of Birth</label>
              <input
                type='date'
                name='dob'
                max='2004-12-30'
                value={dob}
                onChange={(e) => updateFormData(e)}
              />
            </div>
            <div
              className={`${styled.fromGroup} ${styled.fromGroupHalf}`}
              style={{ position: 'relative' }}
            >
              <label>Postal Code</label>
              <input
                type='text'
                name='postalcode'
                value={postalcode}
                onChange={(e) => updateFormData(e)}
              />
              <span onClick={() => generatePostalCode()}>Generate</span>
            </div>
            <div className={`${styled.fromGroup} ${styled.fromGroupHalf}`}>
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='OTHERS'>Others</option>
              </select>
            </div>
            <div className={`${styled.fromGroup} ${styled.fromGroupHalf}`}>
              <label>Mobile Number</label>
              <input
                type='text'
                name='mobile-number'
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>
            <div className={`${styled.fromGroup} ${styled.fromGroupHalf}`}>
              <label>Relationship Status</label>
              {/* value={relationshipStatus} onChange={(event) => setRelationshipStatus(event.target.value)} */}
              <select value={relationship} onChange={(e) => setRelationship(e.target.value)}>
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
              <select value={childern} onChange={(e) => setChildren(e.target.value)}>
                <option value='YES'>Yes</option>
                <option value='NO'>No</option>
              </select>
            </div>
            <div className={`${styled.fromGroup} ${styled.fromGroupHalf}`}>
              <label>Life</label>
              <select value={life} onChange={(e) => setLife(e.target.value)}>
                <option value='ALONE'>Alone</option>
                <option value='AT_PARENTS'>At parents</option>
                <option value='FLAT_SHARE'>Flat Share</option>
                <option value='WITH_PARTNER'>With partner</option>
                <option value='MISCELLANEOUS'>Miscellaneous</option>
              </select>
            </div>
            <div className={`${styled.fromGroup} ${styled.fromGroupHalf}`}>
              <label>Smoker</label>
              <select value={smoker} onChange={(e) => setSmoker(e.target.value)}>
                <option value='YES'>Yes</option>
                <option value='NO'>No</option>
                <option value='STOPPED'>Stopped</option>
                <option value='OCCASIONALLY'>Occasionally</option>
              </select>
            </div>
            <div className={`${styled.fromGroup} ${styled.fromGroupFull}`}>
              <button type='button' onClick={handleChange}>
                Submit
                {isLoading && (
                  <CircularProgress color='secondary' size={20} style={{ marginLeft: '25px' }} />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ********************* */}

      <div className={styled.homeMainRegister1}>
        <div className={styled.wrapwidth}>
          <div className={styled.homeMainRegr}>
            <div>
              <Modal
                open={open}
                onClose={firstHandleClose}
                aria-labelledby='parent-modal-title'
                aria-describedby='parent-modal-description'
              >
                <Box sx={{ ...style, width: 'auto' }} className={styled.modelBoxReg}>
                  {/* <Button onClick={firstHandleClose} className={styled.closeBtnModal}>
                    <img src={CloseIcon} alt='cross icon' />
                  </Button> */}
                  <h2 id='parent-modal-title'>Create 10 Special Users</h2>

                  <p
                    id='parent-modal-description'
                    style={{
                      textAlign: 'center',
                      color: 'rgba(0,0,0,.7)',
                      fontSize: '14px',
                      lineHeight: '20px',
                      margin: '0px 0px 10px;',
                    }}
                  ></p>

                  <form
                    // onSubmit={(e) => {
                    //   loginSubmitHandler(e);
                    // }}
                    className={styled.formLogin}
                  >
                    <div className={styled.formGroup} >
                      <h5 style={{ textAlign: 'left', color: '#a2acba', fontWeight: 'lighter' }}>
                        Min age
                      </h5>
                      <select value={startAge} onChange={(e) => setStartAge(Number(e.target.value))} style={{ cursor: "pointer" }}>
                        {Array.from({ length: 62 }, (_, index) => (
                          <option key={index} value={index + 18}>
                            {index + 18}
                          </option>
                        ))}
                      </select>
                      {/* <TextField
                        id='outlined-basic'
                        label='Min age'
                        variant='outlined'
                        value={""}
                        // onChange={handleInputChange}
                        className={ClassNames.textField}
                        sx={{
                          position: 'relative',
                          borderRadius: '50',
                        }}
                        InputProps={{
                          sx: {
                            color: '#000',
                            borderRadius: 0,
                            // height: "2.25rem"

                          },
                        }}
                      /> */}
                    </div>
                    <div className={styled.formGroup}>
                      <h5 style={{ textAlign: 'left', color: '#a2acba', fontWeight: 'lighter' }}>
                        Max age
                      </h5>
                      <select value={endAge} onChange={(e) => setEndAge(Number(e.target.value))} style={{ cursor: "pointer" }}>
                        {Array.from({ length: 50 }, (_, index) => (
                          <option key={index} value={index + 30}>
                            {index + 30}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styled.formGroup}>
                      <h5
                        style={{
                          textAlign: 'left',
                          color: '#a2acba',
                          fontWeight: 'lighter',
                          fontWeight: 'lighter',
                        }}
                      >
                        Gender
                      </h5>
                      <select
                        value={selectedGender}
                        onChange={(e) => setSelectedGender(e.target.value)}
                        style={{ cursor: "pointer" }}
                      >
                        <option value='Male'>MALE</option>
                        <option value='Female'>FEMALE</option>
                      </select>
                    </div>
                    <div className={styled.formGroup}>
                      <div>
                        <Button
                          onClick={firstHandleClose}
                          sx={{
                            // backgroundColor: 'blue',
                            border: '1px solid #cbcbcb',
                            borderRadius: '4px',
                            color: 'black',
                            padding: '8px 16px',
                            '&:hover': {
                              backgroundColor: '#cbcbcb',
                            },
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                      <div>
                        <Button
                          sx={{
                            backgroundColor: '#308af3',
                            border: '1px solid #cbcbcb',
                            borderRadius: '4px',
                            color: 'white',
                            padding: '8px 16px',
                            '&:hover': {
                              backgroundColor: '#287edf',
                            },
                          }}
                          onClick={() => {
                            const payload = {
                              startAge: startAge,
                              endAge: endAge,
                              gender: selectedGender,
                            };
                            dispatch(createDynamicFakesAction(payload));
                          }}
                        >
                          {loadingSpinner ? (
                            <CircularProgress color='secondary' size={20} style={{ marginLeft: '0px' }} />
                          ) : ('Create')}
                        </Button>
                      </div>
                    </div>
                    <div className={styled.clear}></div>
                  </form>
                </Box>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateFakeUser;

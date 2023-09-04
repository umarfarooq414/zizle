import React from 'react';
import styled from './style.module.css';
import Upload from '../../../assets/images/upload_icon.svg';
import ProfileRemove from '../../../assets/images/profile_cross.svg';
import ProfileUpload from '../../../assets/images/profile_upload.svg';
import UploadGallery from '../../../assets/images/uploadGallery_icon.svg';
import { useUser } from '../../../providers/useUser';

const ProfileText = () => {
  const { user } = useUser();
  return (
    <div>
      <div className={styled.profileDetailsMain}>
        <div className={styled.profileDetaileLeft}>
          <div className={styled.profilePic}>
            <div className={styled.profileRemove}>
              <img src={ProfileRemove} alt='' />{' '}
            </div>
            <div className={styled.profileUpload}>
              <input type='file' className={styled.inputFile} />
              <img src={ProfileUpload} alt='' />
            </div>
          </div>
        </div>
        <div className={styled.profileDetailsRight}>
          <h1>{user.userName}</h1>
          <p>18 years, comes from 91XXX</p>
          <ol>
            <li>
              <h4>Confirm your email</h4>
              <p>+ 16 coins</p>
            </li>
            <li>
              <h4>Avatar upload</h4>
              <p>+ 3 coins</p>
            </li>
            <li>
              <h4>
                Your profile is verified{' '}
                <p>
                  <img src={Upload} alt='upload' />
                </p>
              </h4>
              <p>+ 5 coins</p>
            </li>
            <li>
              <h4>Add mobile number</h4>
              <p>+ 2 coins</p>
            </li>
          </ol>
        </div>
        <div className={styled.clear}></div>

        <div className={styled.uploadGallery}>
          <input type='file' className={styled.fileUpload} accept='image/*' multiple />
          <img src={UploadGallery} alt='sd' />
        </div>
      </div>
    </div>
  );
};

export default ProfileText;

import React from 'react';
// import SettingTabs from "../../components/settingTabs/SettingTabs";
import styled from './style.module.css';
import CustomizedAccordions from './accordion/accordion';
import UserLeftContent from '../../components/userLeftContent/UserLeftContent';
import { Link } from 'react-router-dom';

const FQA = () => {
  return (
    <>
      <div className={styled.UserLeftNavigation}>
        <div className={styled.UserLeftNavigation}>
          <div className={styled.rightFQA}>
            <h3>Frequently asked Questions</h3>
            <p>
              You can find what you are wondering here. If you have additional questions, please{' '}
              <Link to='/contact-support' style={{ color: '#db2777' }}>
                contact support
              </Link>
              .
            </p>
            {/* <CustomizedAccordions /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default FQA;

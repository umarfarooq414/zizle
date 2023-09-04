import React from 'react';
import styled from './style.module.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <div className={styled.footerMain}>
        <div className={styled.footerInner}>
          <div className={styled.copyrightLeft}>
            <p>
              &copy; All copyright Reserved by Zizle - Made with <span>❤</span>
            </p>
          </div>
          <div className={styled.footerMenu}>
            <ul>
              <li>
                <Link to='/data-protection' >Data Protection</Link>
              </li>
              <li>
                <Link to='/term-of-use'>Term of use</Link>
              </li>
              <li>
                <Link to='/imprint'>Imprint</Link>
              </li>
            </ul>
          </div>
          <div className={styled.clear}></div>
        </div>
      </div>
    </>
  );
};

export default Footer;

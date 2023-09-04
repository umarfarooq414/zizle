/* eslint-disable no-undef */
import React, { useState, useContext } from 'react';
import styled from './style.module.css';
import CreditCard from '../../../assets/images/credit-card.png';
import GooglePay from '../../../assets/images/google-pay.png';
import ApplePay from '../../../assets/images/apple-pay.png';
import PayPal from '../../../assets/images/Paypal-logo.png';
import Sofort from '../../../assets/images/Sofort.png';
import BankTransfer from '../../../assets/images/logo-vorkasse.png';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../../../providers/useUser';
import DarkModeContext from '../../../providers/DarkModeContext';
import { Link } from '@material-ui/core';

const PaymentMethod = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const { token } = useUser();
  const params = ['id', 'packageName', 'noOfCoins', 'amount'];
  const paramValues = {};
  for (const param of params) {
    paramValues[param] = queryParams.get(param);
  }

  const { id, packageName, noOfCoins, amount } = paramValues;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const getPaymentUrl = () => {
    const baseUrl = 'https://';
    const commonUrlParams =
      'project=1pc5-zeliz-30e97baf&testmode=1&theme=x2&bgcolor=ebebeb&title=zizle&producttype=product&paytext=to+buy';
    const customizeParams = `amount=${amount * 100}&token=${token}&id=${id}`;
    switch (selectedPaymentMethod) {
      case 'credit':
        return `https://creditcard.micropayment.de/creditcard/event/?project=14qp-vmylu-a504badb&testmode=1&theme=x2&bgcolor=ebebeb&title=mylovu&producttype=product&seal=d74fda6916457f5a94319981ccba5dfb&amount=${amount*100}&token=${token}&id=${id}`;
      case 'paypal':
        return `${baseUrl}paypal.micropayment.ch/paypal/event/?${commonUrlParams}&currency=EUR&seal=f5f6ca40e4199acf547ca0d259347c1a&${customizeParams}`;
      //`${baseUrl}paypal.micropayment.ch/paypal/event/?${commonUrlParams}&currency=EUR&amount=5000&seal=f5f6ca40e4199acf547ca0d259347c1a`;
      case 'bankTransfer':
        return `https://prepayment.micropayment.de/prepay/event/?project=14qp-vmylu-a504badb&testmode=1&theme=x2&bgcolor=ebebeb&title=zizle+coins&producttype=product&amount=${amount*100}&token=${token}&id=${id}&seal=a5fb4272e7b07d0ff4f5a6868121fecf`;
      case 'sofort':
        return `https://directbanking.micropayment.de/sofort/event/?project=14qp-vmylu-a504badb&testmode=1&theme=x2&bgcolor=ebebeb&title=mylovu&producttype=product&seal=d74fda6916457f5a94319981ccba5dfb&amount=${amount*100}&token=${token}&id=${id}`;
      default:
        return '#';
    }
  };
  const url = `${getPaymentUrl()}`;
  return (
    <div>
      <div className={styled.paymentMethodUi}>
        <div className={styled.paymentMethodList}>
          <h3>
            Choose one <span style={{ color: isDarkMode ? '#fff' : '#000' }}>payment method</span>
          </h3>
          <ul>
            <li onClick={() => setSelectedPaymentMethod('credit')}>
              <div className={styled.cardDetails}>
                <input
                  type='radio'
                  id='creditcard'
                  name='paymentmethods'
                  value='Credit Card'
                  checked={selectedPaymentMethod === 'credit'}
                />
                {/* <label for='creditcard'>Credit Card</label>
                <br />
                <p>Safe payment</p> */}
                <img src={CreditCard} alt='' />
                <img src={GooglePay} alt='' />
                <img
                  src={ApplePay}
                  alt=''
                  style={{
                    ...(isDarkMode ? { filter: 'invert(80%)' } : null),
                  }}
                />
              </div>
              {/* <div className={styled.cardDetailsImg}>
                <img src={CreditCard} alt='' />
                <img src={GooglePay} alt='' />
                <img src={ApplePay} alt='' />
              </div> */}
                <div className={styled.clear}></div>
            </li>

            {/* ******************************* */}

            {/* ******************************* */}
            <li onClick={() => setSelectedPaymentMethod('paypal')}>
              <div className={styled.cardDetails}>
                <input
                  type='radio'
                  id='paypal'
                  name='paymentmethods'
                  value='PayPal'
                  checked={selectedPaymentMethod === 'paypal'}
                />
                {/* <label for='paypal'>PayPal</label>
                <br />
                <p>Safe payment</p> */}
                <img src={PayPal} alt='' />
              </div>
              {/* <div className={styled.cardDetailsImg}>
                <img src={PayPal} alt='' />
              </div> */}
              <div className={styled.clear}></div>
            </li>
            <li onClick={() => setSelectedPaymentMethod('sofort')}>
              <div className={styled.cardDetails}>
                <input
                  type='radio'
                  id='immediately'
                  name='paymentmethods'
                  value='Immediately'
                  checked={selectedPaymentMethod === 'sofort'}
                />
                {/* <label for='immediately'>Immediately</label>
                <br />
                <p>Safe payment</p> */}
                <img src={Sofort} alt='' />
              </div>
              {/* <div className={styled.cardDetailsImg}>
                <img src={Sofort} alt='' />
              </div> */}
              <div className={styled.clear}></div>
            </li>
            <li onClick={() => setSelectedPaymentMethod('bankTransfer')}>
              <div className={styled.cardDetails}>
                <input
                  type='radio'
                  id='directtransfer'
                  name='paymentmethods'
                  value='Payment in advance'
                  checked={selectedPaymentMethod === 'bankTransfer'}
                />
                {/* <label for='directtransfer'>Payment in advance</label>
                <br />
                <p>Safe payment</p> */}
                <img src={BankTransfer} alt='' />
              </div>
              {/* <div className={styled.cardDetailsImg}>
                <img src={BankTransfer} alt='' />
              </div> */}
              <div className={styled.clear}></div>
            </li>
          </ul>
        </div>
        <div className={styled.couponPackage}>
          <div className={styled.packagesList}>
            <div className={styled.packages}>
              <div className={styled.packageTitle}>
                <h2>{packageName && packageName}</h2>
                <h3>{noOfCoins && noOfCoins} Coins</h3>
                <hr />
                <h5>
                  <p>total ammount:</p> € {amount && amount}
                </h5>
                <p className={styled.packagepara}>
                  By submitting this form, I agree to the Terms of Use and Privacy Policy.
                </p>
              </div>
              <button
                className={styled.yourButtonClassName}
                disabled={!selectedPaymentMethod}
                onClick={() => {
                  if (selectedPaymentMethod === 'paypal') {
                    navigate('/paymentPayPal', { state: { item: paramValues } });
                  } else {
      window.location.href = url;
    }
                }}
              >
                Buy
              </button>
            </div>
          </div>
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default PaymentMethod;

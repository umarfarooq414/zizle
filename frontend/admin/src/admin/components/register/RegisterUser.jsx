import React, { useState } from 'react';
import styled from '../login/style.module.css';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resigterAdminModAction } from '../../../store/slices/userAuth/actions';
const RegisterUser = () => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const adminRegSubmitHandler = (event) => {
    event.preventDefault();
    const payload = {
      firstName,
      lastName,
      email,
      password,
    };
    dispatch(resigterAdminModAction(payload));
  };

  return (
    <div>
      <div className={styled.container_login100}>
        <div
          className={`${styled.wrap_login100} ${styled.p_l_55} ${styled.p_r_55} ${styled.p_t_65} ${styled.p_b_54}`}
        >
          <form
            onSubmit={(event) => {
              adminRegSubmitHandler(event);
            }}
            className={`${styled.login100_form} ${styled.validate_form}`}
          >
            <span className={`${styled.login100_form_title} ${styled.p_b_49}`}>Register</span>
            <div className={styled.loginRegisterText}>
              <p>
                Already have an account? <Link to='/'>Sign in</Link>
              </p>
            </div>
            <div
              className={`${styled.wrap_input100} ${styled.validate_input} ${styled.m_b_23}`}
              data-validate='First name is require'
            >
              <span className={styled.label_input100}>First Name</span>
              <input
                className={styled.input100}
                type='text'
                name='Fname'
                placeholder='Type your first name'
                onChange={(event) => setFirstName(event.target.value)}
              />
              {/* <span className={styled.focus_input100} data-symbol=""></span> */}
            </div>

            <div
              className={`${styled.wrap_input100} ${styled.validate_input} ${styled.m_b_23}`}
              data-validate='Last name is reauired'
            >
              <span className={styled.label_input100}>Last Name</span>
              <input
                className={styled.input100}
                type='text'
                name='lastname'
                placeholder='Type your last name'
                onChange={(event) => setLastName(event.target.value)}
              />
              {/* <span className={styled.focus_input100} data-symbol=""></span> */}
            </div>

            <div
              className={`${styled.wrap_input100} ${styled.validate_input} ${styled.m_b_23}`}
              data-validate='Email is reauired'
            >
              <span className={styled.label_input100}>Email</span>
              <input
                className={styled.input100}
                type='email'
                name='email'
                placeholder='Type your email'
                onChange={(event) => setEmail(event.target.value)}
              />
              {/* <span className={styled.focus_input100} data-symbol=""></span> */}
            </div>
            <div
              className={`${styled.wrap_input100} ${styled.validate_input}`}
              data-validate='Password is required'
            >
              <span className={styled.label_input100}>Password</span>
              <input
                className={styled.input100}
                type='password'
                name='pass'
                placeholder='Type your password'
                onChange={(event) => setPassword(event.target.value)}
              />
              {/* <span className={styled.focus_input100} data-symbol=""></span> */}
            </div>
            {/* <div className={`${styled.text_right} ${styled.p_t_8} ${styled.p_b_31}`}>
              <Link to="#">Forgot password?</Link>
            </div> */}
            <div className={styled.container_login100_form_btn}>
              <div className={styled.wrap_login100_form_btn}>
                <div className={styled.login100_form_bgbtn}></div>
                <button className={styled.login100_form_btn}>Login</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;

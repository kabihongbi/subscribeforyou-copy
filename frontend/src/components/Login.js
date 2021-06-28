import React, { useRef, useState } from 'react';
import axios from 'axios';
import * as valid from '../lib/validation.js';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUser, setToken } from '../modules/auth';

function Login({ user, token, setUser, setToken }) {
  const initialUser = {
    userid: '',
    password: '',
  };

  const history = useHistory();
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [errorMsg, setErrorMsg] = useState('');
  const [idErrorMsg, setIdErrorMsg] = useState('');
  const [pwErrorMsg, setPwErrorMsg] = useState('');

  const idBox = useRef();
  const pwBox = useRef();

  async function Login() {
    if (!valid.idValidation(currentUser.userid).result) {
      setIdErrorMsg(valid.idValidation(currentUser.userid).message);
      setCurrentUser({ ...currentUser, userid: '' });
      idBox.current.focus();
      return;
    }

    if (!valid.pwValidation(currentUser.password).result) {
      setPwErrorMsg(valid.pwValidation(currentUser.password).message);
      setCurrentUser({ ...currentUser, password: '' });
      pwBox.current.focus();
      return;
    } else {
      setPwErrorMsg('');
    }

    try {
      const result = await axios.post('auth/api/login', {
        userid: currentUser.userid,
        password: currentUser.password,
      });
      console.log(result);

      if (result.status === 200) {
        //로그인 성공 시
        console.log(result);
        setUser(result.data.userid);
        setToken(result.data.token);

        sessionStorage.setItem('token', result.data.token);
        sessionStorage.setItem('userid', result.data.userid);
        
        if(user) {
          history.push('/');
        }
      }
    } catch (e) {
      console.log(e.response);
      const error = e.response.status;
      switch (error) {
        case 401:
          console.log(error);
          setErrorMsg('아이디 또는 비밀번호가 다릅니다.');
          break;
        default:
          break;
      }
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    Login();
  }

  function onChange(e) {
    const { name, value } = e.target;

    switch (name) {
      case 'userid':
        setCurrentUser({ ...currentUser, userid: value });
        break;
      case 'password':
        setCurrentUser({ ...currentUser, password: value });
        break;
      default:
        break;
    }
  }
  return (
    <div className='flex h-full items-center justify-center text-xs md:text-base'>
      <div className='flex h-full rounded-sm w-full items-center justify-center'>
        <form
          onSubmit={onSubmit}
          className='flex flex-col rounded-lg shadow-md bg-gray-100 h-1/2 justify-center px-10 lg:w-1/2'
        >
          <label className='w-full'>
            <div className="font-medium mb-1">아이디</div>
            <input
              ref={idBox}
              name="userid"
              className="border w-full p-1"
              onChange={onChange}
              value={currentUser.userid}
              required
            />
            {idErrorMsg && <div className="text-xs">{idErrorMsg}</div>}
          </label>
          <label className='w-full mt-4'>
            <div className="flex flex-col mb-1 md:flex-row md:items-center">
              <span className="font-medium">비밀번호</span>
              <span className="text-xs lg:text-sm text-gray-400 lg:ml-5">* 8~15자, 영어, 숫자, 특수문자 포함</span>
            </div>
            <input
              ref={pwBox}
              type="password"
              name="password"
              className="border w-full p-1"
              onChange={onChange}
              value={currentUser.password}
              required
            />
            {pwErrorMsg && <div className="text-xs">{pwErrorMsg}</div>}
            {errorMsg && <div className="text-xs">{errorMsg}</div>}
          </label>
          <button
            type="submit"
            className="rounded-md bg-blue-700 text-white mt-5 p-1"
          >
            로그인
          </button>
          <div
            className="w-full text-center underline text-blue-500 cursor-pointer"
            onClick={() => {
              history.push('/register');
            }}
          >
            계정이 없으신가요?
          </div>
        </form>
      </div>
    </div>
  );
}

export default connect(
  (state) => ({
    user: state.auth.user,
    token: state.auth.token,
  }),
  {
    setUser,
    setToken,
  },
)(Login);

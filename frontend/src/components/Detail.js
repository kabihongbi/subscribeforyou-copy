import { useRef, useState } from 'react';
import React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import * as valid from '../lib/validation';

function Detail() {
   
    
    const history = useHistory();
    const [originPwd, setOriginPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [reNewPwd, setReNewPwd] = useState('');
    //const [errorMsg, setErrorMsg] = useState('');
    const [message, setMessage] = useState('');

  const history = useHistory();

     function Detail(){
        //새로운 비밀번호 유효성 검사
        if (!valid.pwValidation(newPwd).result) {
            setNewPwd(valid.pwValidation(newPwd).message);
            setNewPwd('');
            newPwdBox.current.focus();
            return;
          } 

        //새로운 비밀번호, 재입력한 새로운 비밀번호 서로 일치하는지 확인
        if(newPwd !== reNewPwd){
            setNewPwd('');
            setReNewPwd('');
            newPwdBox.current.focus();
        }    
                axios({
                url:'/auth/api/user',
                method: 'patch',
                data:{
                old_pwd: originPwd,
                new_pwd: newPwd,
                re_pwd: reNewPwd},
                headers : {'Authorization' : `Token ${sessionStorage.getItem('token')}`},
                }).then((res)=>{
                    console.log(res);
                    const statusCode = res.status;
                    if (statusCode === 201) {
                        setMessage('');
                      }

                }).catch((e)=>{console.log(e);
                    setMessage('에러입니다');
                });
         }

    if (newPwd !== reNewPwd) {
      setNewPwd('');
      setReNewPwd('');
      newPwdBox.current.focus();
      return;
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    Valid();
  }

  function onChange(e) {
    const { name, value } = e.target;

    switch (name) {
      case 'originPwd':
        setOriginPwd(value);
        break;
      case 'newPwd':
        setNewPwd(value);
        break;
      case 'reNewPwd':
        setReNewPwd(value);
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
                    className='flex flex-col rounded-lg shadow-md bg-gray-100 h-1/2 justify-center px-10 lg:w-1/2'>
                        <label className='w-full'>
                            <div className="font-medium mb-1">현재 비밀번호</div>
                                <input
                                    ref={originPwdBox} 
                                    name="originPwd"
                                    className="border w-full p-1"
                                    type="password"
                                    onChange={onChange}
                                    value={originPwd}
                                    required
                                />
                        </label>

                        <label className='w-full mt-4'>
                            <div className='flex flex-col mb-1 md:flex-row md:items-center'>
                                <span className="font-medium">새 비밀번호</span>
                                <span className="text-xs lg:text-sm text-gray-400 lg:ml-5">* 8~15자, 영어, 숫자, 특수문자 포함</span>
                            </div>
                                <input 
                                    ref={newPwdBox}
                                    name="newPwd"
                                    className="border w-full p-1"
                                    type="password"
                                    onChange={onChange}
                                    value={newPwd}
                                    required
                                />
                        </label>

                        <label className='w-full mt-4'>
                            <div className='flex flex-col mb-1 md:flex-row md:items-center'>새 비밀번호 확인</div>
                                <input
                                    ref={reNewPwdBox} 
                                    name="reNewPwd"
                                    className="border w-full p-1"
                                    type="password"
                                    onChange={onChange}
                                    value={reNewPwd}
                                    required
                                />
                        </label>

                        {message}

                        <button
                        type="submit"
                        className="rounded-md bg-blue-700 text-white mt-5 p-1"
                        >
                        비밀번호 변경
                        </button>

                        <button
                        type="button"
                        className="rounded-md bg-red-700 text-white mt-5 p-1"
                        onClick={() => {
                            history.push('/dropout');
                          }}
                        >
                        탈퇴하기
                        </button> 
                    </form>
                   
                </div>
            </div>
    );
}


export default Detail;
import React, { useState } from 'react';
import './style.css';

export default function Login() {

    const [userData, setUserData] = useState({
        email: '',
        password: '',
        role: '',
    })
    const [errMsg, setErrMsg] = useState("")

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(userData)
        
        setUserData({
            email: "",
            password: "",
            role: "",
        })
    }

  return (
    <section className='login-body'>
       <div className='login-container shadow'>
            <h1 className='text-center mb-2'>
                Welcome
            </h1>
            <p className='text-center mb-2 text-sm text-light'>
                Fill in your login credentials.
            </p>

            <div className='login-form'>
                <form className='login-form p-2' onSubmit={handleSubmit}>
                    <div className='form-group mb-2'>
                        <label htmlFor='email'>Email Address</label>
                        <input 
                            type='email'
                            className='form-control mt-1 p-2'
                            placeholder='Email Address'
                            required
                            name="email"
                            onChange={handleChange}
                        />
                    </div>
                    <div className='form-group mb-2'>
                        <label htmlFor='password'>Password</label>
                        <input 
                            type='password'
                            className='form-control mt-1 p-2'
                            placeholder='xxxxxxxx'
                            required
                            minLength={8}
                            name="password"
                            onChange={handleChange}
                        />
                        <p className='small-text text-light m-0'>
                            Password should be atleast 8 characters long.
                        </p>
                    </div>
                    <div className='form-group mb-4'>
                        <label htmlFor='role'>Role</label>
                        <select 
                            type='password'
                            className='form-control mt-1 p-2 text-muted'
                            placeholder='xxxxxxxx'
                            required
                            name="role"
                            onChange={handleChange}
                        >
                            <option value={""}>Select your role</option>
                            <option value={"student"}>Student</option>
                            <option value={"admin"}>Admin</option>
                        </select>
                        
                    </div>

                   {errMsg && (<div className='p-2 text-center text-warning fs-5'>
                        {errMsg}
                    </div>)}

                    <div className='mb-2'>
                        <button type='submit' className='btn btn-dark w-100 p-2' onClick={()=>{}}>Submit</button>
                    </div>
                </form>
            </div>
       </div>
    </section>
  )
}

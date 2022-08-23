import React from 'react';
import './style.css';

export default function Login() {
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
                <form className='login-form p-2'>
                    <div className='form-group mb-2'>
                        <label htmlFor='email'>Email Address</label>
                        <input 
                            type='email'
                            className='form-control mt-1 p-2'
                            placeholder='Email Address'
                        />
                    </div>
                    <div className='form-group mb-2'>
                        <label htmlFor='password'>Password</label>
                        <input 
                            type='password'
                            className='form-control mt-1 p-2'
                            placeholder='xxxxxxxx'
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
                        >
                            <option value={""}>Select your role</option>
                            <option value={"student"}>Student</option>
                            <option value={"admin"}>Admin</option>
                        </select>
                        
                    </div>
                    <div className='mb-2'>
                        <button type='submit' className='btn btn-dark w-100 p-2' onClick={()=>{}}>Submit</button>
                    </div>
                </form>
            </div>
       </div>
    </section>
  )
}

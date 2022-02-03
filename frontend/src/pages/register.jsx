import React from 'react';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';

const CREATE_USER = gql`
    mutation createUser($email: String!, $first_name: String!, $last_name: String!, $password: String!) {
        createUser(email: $email 
                password: $password 
                firstName: $first_name
                lastName: $last_name)
        {
        id
        email
        username
        firstName
        lastName
        }
    }
`;


function Register() {
    const navigate = useNavigate()
    const [createUser, { data, loading, error, reset }] = useMutation(CREATE_USER);
    const [inputs, setInputs] = React.useState({})
    const [errors, setErrors] = React.useState({})

    const handleChange = (e)=>{
        if(e.target.name === 'password_conf'){
            setErrors({password_conf: e.target.value !== inputs.password})
        }
        setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const onSubmit = (e)=>{
        e.preventDefault()
        createUser({variables: {...inputs}})
        .then(resp => navigate('/login'))
    }



    const token = localStorage.getItem('auth-token')
    if(token)
        return <Navigate to="/"/>

    return(
        <div className='m-auto w-50'>
            <div className="card shadow-lg p-5 mt-5">
                <h1 className="text-center">Sign up</h1>
                {/* <div className="alert alert-danger" role="alert">
                    A simple danger alert—check it out!
                </div> */}
                <form noValidate onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">First Name</label>
                        <input type="text" name='first_name' className="form-control" onChange={handleChange} aria-describedby="emailHelp"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Last Name</label>
                        <input type="text" name='last_name' className="form-control" onChange={handleChange} aria-describedby="emailHelp"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="text" name='email' className="form-control" onChange={handleChange} aria-describedby="emailHelp"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword" className="form-label">Password</label>
                        <input type="password" name='password' onChange={handleChange} className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" name='password_conf' onChange={handleChange} className={`form-control ${errors.password_conf && 'is-invalid'}`} />
                        {errors.password_conf && <div className="form-text text-danger">Password did't match</div>}
                    </div>
                    <Link className='mx-3' to="/login">Already have an account?</Link>
                    <button disabled={loading} type="submit" className="btn btn-primary">Signup</button>
                </form>
            </div>
        </div>
    )
}

export default Register;

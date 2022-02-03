import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';



const LOGIN_USER = gql`
    mutation login($username: String!, $password: String!) {
        login (username: $username, password: $password) {
        token
        }
    }
`;


function Login() {
    const navigate = useNavigate()
    const [login, { loading, error, reset }] = useMutation(LOGIN_USER);
    const [inputs, setInputs] = React.useState({})

    const handleChange = React.useCallback((e)=>{
        setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
    }, [])

    const onSubmit = (e)=>{
        e.preventDefault()
        login({variables: {...inputs}})
        .then(resp => {
            localStorage.setItem('auth-token', resp.data.login?.token)
            navigate('/')
        })
    }
    
    const token = localStorage.getItem('auth-token')
    if(token)
        return <Navigate to="/"/>

    return(
        <div className='m-auto w-50'>
            <div className="card shadow-lg p-5 mt-5">
                <h1 className="text-center">Login</h1>
                <form noValidate onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">username</label>
                        <input type="text" name='username' className="form-control" onChange={handleChange} aria-describedby="emailHelp"/>
                        {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" name='password' onChange={handleChange} className="form-control" />
                    </div>
                    <Link className='mx-3' to="/register">I do not have an account?</Link>
                    <button disabled={loading} type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login;

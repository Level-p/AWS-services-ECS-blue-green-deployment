import {useEffect, useState} from 'react'
import { FaSignInAlt } from 'react-icons/fa'
import {toast} from "react-toastify"
import {useSelector, useDispatch} from 'react-redux'
import { login } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const { email, password} = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {user, isLoading, isError, isSuccess, message} = useSelector(state => state.auth)

    useEffect(() => {
        if(isError) {
            toast.error(message)
        }

        if(isSuccess && user) {
            navigate('/')
            toast.success('welcome back!')
        }
    }, [isError, isSuccess, message, navigate, user])


    const onChange = (e) => {
        setFormData((prevstate) => ({
            ...prevstate,
            [e.target.id]: e.target.value
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault()

        const userData = {
            email,
            password
        }

        dispatch(login(userData))
    }

    if(isLoading) {
        return <Spinner/>
    }

  return (
    <>
        <section className="heading">
            <h1>
                <FaSignInAlt/> Login
            </h1>
            <p>Please login to get support</p>
        </section>

        <section className="form">
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <input id='email' 
                    value={email} 
                    type="email" 
                    className="form-control" 
                    onChange={onChange} 
                    required
                    placeholder='Enter your email'/>
                </div>
                <div className="form-group">
                    <input id='password' 
                    value={password} 
                    type="password" 
                    className="form-control" 
                    onChange={onChange} 
                    required
                    placeholder='Enter your password'/>
                </div>
                <div className="form-group">
                    <button type='submit' className="btn btn-block">
                        Submit
                    </button>
                </div>
            </form>
        </section>
    </>
  )
}

export default Login
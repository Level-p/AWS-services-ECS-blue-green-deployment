import {useState, useEffect} from 'react'
import { FaUser } from 'react-icons/fa'
import {toast} from "react-toastify"
import {useSelector, useDispatch} from 'react-redux'
import { register, reset } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })

    const {name, email, password, password2} = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {user, isLoading, isSuccess, isError, message} = useSelector(state => state.auth)

    useEffect(() => {
        if(isError) {
            toast.error(message)
        }

        // Redirect when logged in
        if(isSuccess && user) {
            navigate('/')
        }

        dispatch(reset())
    }, [isError, isSuccess, user, message, navigate, dispatch])

    const onChange = (e) => {
        setFormData((prevstate) => ({
            ...prevstate,
            [e.target.id]: e.target.value
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault()

        if(password !== password2) {
            toast.error('passwords do not match')
        } else {
            const userData = {
                name,
                email,
                password
            }

            dispatch(register(userData))
        }
    }

    if(isLoading) {
        return <Spinner/>
    }

  return (
    <>
        <section className="heading">
            <h1>
                <FaUser/> Register
            </h1>
            <p>Please create an account</p>
        </section>

        <section className="form">
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <input id='name' 
                    value={name} 
                    type="text" 
                    className="form-control" 
                    onChange={onChange} 
                    required
                    placeholder='Enter your name'/>
                </div>
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
                    <input id='password2' 
                    value={password2} 
                    type="password" 
                    className="form-control" 
                    onChange={onChange} 
                    required
                    placeholder='Confirm password'/>
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

export default Register
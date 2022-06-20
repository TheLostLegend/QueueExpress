import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './auth'
import UserService from "../services/UserService";
import '../App.css';

const STUDENTS_PATH = '/profile';

export const Login = () => {
  const [user, setUser] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const navigate = useNavigate()
  const auth = useAuth()

  const handleLogin = () => {
    let newUser = { name: user, queue_Num: 0 };

    UserService.createUser(newUser)
      .then(() => {
        sessionStorage.setItem('user', JSON.stringify(user));
        navigate(STUDENTS_PATH);
      })
      .catch((e) => {
        setErrorMessage("Неверный ввод данных Your Name.");
      });
  }

  const handleClearError = () => {
    setErrorMessage(null);
  }

  return (
    <div className='login-container'>
      {errorMessage && <div className="alert alert-danger alert-dismissible fade show">
        <strong>Error!</strong> {errorMessage}
        <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={handleClearError}></button>
      </div>}
        <span className='login-containertext'> Your Name: </span> 
        <input className='login-containerinput' type='text' onChange={e => setUser(e.target.value)} />
      <button className='login-container__btn-confirm' onClick={handleLogin}>Login</button>
    </div>
  )
}
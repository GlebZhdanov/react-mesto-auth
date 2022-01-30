import React from "react";
import {Link, useNavigate} from 'react-router-dom'
import { auth } from "../utils/Auth";

function Register (props) {
  const[email, setEmail] = React.useState('');
  const[password, setPassword] = React.useState('');
  // const navigate = useNavigate;

  function handleEmail(e) {
    setEmail(e.target.value)
  }

  function handlePassword(e) {
    setPassword(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.handleRegister(password, email);
  }

  return (
    <div className="container">
      <h2 className="container__header">
        Регистрация
      </h2>
      <form className="form" onSubmit={handleSubmit}>
        <input className="form__input"  type="email" placeholder="Email" required onChange={handleEmail}/>
        <input className="form__input"  type="password" placeholder="Пароль" required onChange={handlePassword}/>
        <button className="form__submit-button" type="submit">
          Зарегистрироваться
        </button>
      </form>
      <p className="container__title">Уже зарегистрированы?
        <Link to="/sign-in" className="container__login-link"> Войти</Link>
      </p>
    </div>
  );
};
export default Register;
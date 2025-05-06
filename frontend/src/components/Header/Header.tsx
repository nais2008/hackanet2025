import { Link } from "react-router-dom"
import { HashLink } from "react-router-hash-link"

import logo from "/logo.svg"

import "./Header.scss"

const Header = () => {
  return (
    <header>
      <Link to="/" className="logo">
        <img src={ logo } alt="logo" />
        TasksHub
      </Link>
      <nav>
        <ul>
          <li>
            <HashLink smooth  to="/#proces">Процесс</HashLink>
          </li>
          <li>
            <HashLink smooth  to="/#feedback">Отзывы</HashLink>
          </li>
        </ul>
      </nav>
      <div className="btns">
        <Link className="btn" to="/p">Использовать</Link>
        <Link className="btn" to="/login">Войти</Link>
      </div>
    </header>
  )
}

export default Header

import { Link } from "react-router-dom"

import logo from "/logo.svg"

import "./Header.scss"

const Header = () => {
  return (
    <header>
      <Link to="/" className="logo">
        <img src={ logo } alt="logo" />
        TaskHub
      </Link>
      <nav>
        <ul></ul>
      </nav>
      <div className="btns">
        <Link className="btn" to="/">Try</Link>
        <Link className="btn" to="/signup">Sgin Up</Link>
      </div>
    </header>
  )
}

export default Header

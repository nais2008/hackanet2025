import { Link } from "react-router-dom"

import logo from "/logo.svg"

import "./Footer.scss"

const Footer = () => {
  return (
    <footer>
      <div className="left">
        <Link to="/" className="logo">
          <img src={ logo } alt="logo" />
          TasksHub
        </Link>
        <p>© 2025 TaskHub Labs, Inc.</p>
      </div>
      <div className="right">
        <ul>
          <li>
            <Link to="https://github.com/nais2008/hackanet2025" target="_blank">GitHub Repositori</Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="https://github.com/nais2008" target="_blank">nais2008</Link>
          </li>
          <li>
            <Link to="https://github.com/Rayten225" target="_blank">Rayten225</Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/p">Использовать TasksHub</Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer

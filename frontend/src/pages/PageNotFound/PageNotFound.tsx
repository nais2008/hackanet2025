import { Link } from "react-router-dom"

import "./PageNotFound.scss"

const PageNotFound = () => {
  return (
    <div className="error">
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link to="/" className="btn">На главную</Link>
    </div>
  )
}

export default PageNotFound

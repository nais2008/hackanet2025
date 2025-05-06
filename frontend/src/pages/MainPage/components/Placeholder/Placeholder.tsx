import { Link } from "react-router-dom"

import "./Placeholder.scss"

import task from "../../../../assets/img/task.svg"

const Placeholder = () => {
  return (
    <section className="placeholder">
      <div className="text">
        <h1>TasksHub: где хаос превращается в порядок</h1>
        <Link to="/" className="btn">Использовать TasksHub</Link>
      </div>
      <img src={ task } alt="" />
      <div className="circle"></div>
    </section>
  )
}

export default Placeholder

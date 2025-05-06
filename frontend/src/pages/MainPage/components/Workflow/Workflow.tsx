import "./Workflow.scss"

import img from "../../../../assets/img/workflow.png"

const Workflow = () => {
  return (
    <section className="workflow" id="proces">
      <div className="workflow__header">
        <h1>Ваш рабочий процесс</h1>
        <p>
          Все ваши проекты, цели,
          задачи и многое другое —
          в одном инструменте,
          персонализированном в соответствии
          с вашим стилем и стилем работы вашей команды
        </p>
      </div>
      <img src={ img } alt="" />
    </section>
  )
}

export default Workflow

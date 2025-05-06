import { useParams, Navigate } from "react-router-dom"

import "./ProjectIdPage.scss"

const projects = [
  { id: "1", name: "Project 1" },
  { id: "2", name: "Project 2" },
];

const ProjectIdPage = () => {
  const { id } = useParams()

  const project = projects.find(project => project.id === id)

  if (!project){
    return <Navigate to="/404" replace />
  }

  return (
    <div className="project-id-page">
      <h1>{project.name}</h1>
      <p>ID: {project.id}</p>
    </div>
  )
}

export default ProjectIdPage

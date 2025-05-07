import { useState, useEffect } from "react";
import SearchComponent from "../../components/SearchComponent";
import ProjectModal from "../../components/ProjectModal";
import { FaPlus } from "react-icons/fa";
import "./ProjectPage.scss";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  image?: string;
}

const ProjectPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const backendUrl = import.meta.env.VITE_URL_BACKEND || "http://localhost:8080/api/v1";
        const response = await fetch(`${backendUrl}/projects`);
        if (!response.ok) throw new Error("Ошибка сети или сервера");
        const data: Project[] = await response.json();
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error("Ошибка загрузки проектов:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleSearch = (query: string) => {
    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const handleFilterChange = (filter: string) => {
    let filtered = [...projects];
    switch (filter) {
      case "Завершённые":
        filtered = filtered.filter((project) => project.name.includes("Завершён"));
        break;
      case "Самые активные":
      case "Все проекты":
      default:
        filtered = [...projects];
        break;
    }
    setFilteredProjects(filtered);
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleSaveProject = async (project: Project, file?: File) => {
    try {
      const backendUrl = import.meta.env.VITE_URL_BACKEND || "http://localhost:8080/api/v1";
      const method = editingProject ? "PUT" : "POST";
      const url = editingProject
        ? `${backendUrl}/projects/${project.id}`
        : `${backendUrl}/projects`;

      const formData = new FormData();
      formData.append("name", project.name);
      formData.append("createdAt", project.createdAt);
      if (file) {
        formData.append("image", file);
      }

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) throw new Error("Ошибка при сохранении проекта");

      const updatedProject: Project = await response.json();
      let updatedProjects: Project[];

      if (editingProject) {
        updatedProjects = projects.map((p) =>
          p.id === updatedProject.id ? updatedProject : p
        );
      } else {
        updatedProjects = [...projects, updatedProject];
      }

      setProjects(updatedProjects);
      setFilteredProjects(updatedProjects);
    } catch (error) {
      console.error("Ошибка при сохранении проекта:", error);
    }
  };

  return (
    <>
      <div className="header">
        <SearchComponent
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />
      </div>
      <div className="projects-list">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="project-item"
              onClick={() => handleEditProject(project)}
            >
              <img
                src={project.image || "https://via.placeholder.com/100"}
                alt={project.name}
                className="project-image"
              />
              <div className="project-info">
                <h3>{project.name}</h3>
                <p>Создан: {new Date(project.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-projects">
            <button className="create-project-button" onClick={handleCreateProject}>
              <FaPlus size={30} />
            </button>
          </div>
        )}
      </div>
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProject}
        project={editingProject}
      />
    </>
  );
};

export default ProjectPage;

import { useState, useEffect } from "react";
import SearchComponent from "../../components/SearchComponent";
import "./ProjectPage.scss";

interface Project {
  id: string;
  name: string;
  createdAt: string;
}

const ProjectPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

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
        filtered = filtered.filter((project) => project.name.includes("Завершён")); // Пример фильтрации
        break;
      case "Самые активные":
      case "Все проекты":
      default:
        filtered = [...projects]; // Без фильтрации
        break;
    }
    setFilteredProjects(filtered);
  };

  return (
    <>
      <div className="header">
        <SearchComponent onSearch={handleSearch} onFilterChange={handleFilterChange} />
      </div>
      <div className="projects-list">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div key={project.id} className="project-item">
              <h3>{project.name}</h3>
              <p>Создан: {new Date(project.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>Проекты не найдены.</p>
          
        )}
      </div>
    </>
  );
};

export default ProjectPage;

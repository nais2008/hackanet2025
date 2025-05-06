import { useState } from "react";
import { TiPlus } from "react-icons/ti";
import { IoIosExit } from "react-icons/io";
import { MdDelete } from "react-icons/md";

import SearchComponent from "../../components/SearchComponent"

import "./ProjectMemberPage.scss"


const ProjectMemberPage: React.FC = () => {
  const [member, setMember] = useState<Project[]>([]);
  const [filteredMember, setFilteredMember] = useState<Project[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Project | null>(null);

  const handleSearch = (query: string) => {
    const filtered = member.filter((project) =>
      project.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMember(filtered);
  };

  const handleFilterChange = (filter: string) => {
    let filtered = [...member];
    switch (filter) {
      case "Завершённые":
        filtered = filtered.filter((project) => project.name.includes("Завершён"));
        break;
      case "Самые активные":
      case "Все проекты":
      default:
        filtered = [...member];
        break;
    }
    setFilteredMember(filtered);
  };

  return (
    <>
      <div className="header">
        <SearchComponent
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          showFilter={false}
        />
      </div>
      <div className="add-member">
        <div className="member">
        <div className="avatar-placeholder" />
            <div className="user-info">
              <div className="name">
                name <span className="admin-tag">(admin)</span>
              </div>
              <div className="username">username</div>
          </div>
          <TiPlus size={30}/>
        </div>
        <div className="member">
          <div className="avatar-placeholder" />
            <div className="user-info">
              <div className="name">
                name
              </div>
              <div className="username">username</div>
          </div>
          <IoIosExit  size={30}/>
        </div>
        <div className="member">
          <div className="avatar-placeholder" />
            <div className="user-info">
              <div className="name">
                name <span className="admin-tag">(admin)</span>
              </div>
              <div className="username">username</div>
          </div>
          <MdDelete size={30}/>
        </div>
      </div>
    </>
  );
}

export default ProjectMemberPage

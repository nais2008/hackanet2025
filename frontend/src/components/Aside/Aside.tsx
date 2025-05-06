import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { FiSidebar } from "react-icons/fi";
import { AiFillProject } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import { RiUploadCloudFill } from "react-icons/ri";
import { Link, NavLink } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa";
import { BiSolidFileJson } from "react-icons/bi";
import DropDown from "../DropDown";
import ContextMenu from "../ContextMenu";
import "./Aside.scss";

interface IAside {
  isOpen: boolean;
  onClose: () => void;
}

const Aside: React.FC<IAside> = ({ isOpen, onClose }) => {
  const [isContextMenuVisible, setContextMenuVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Профиль");

  const menuItems = [
    { icon: <BiSolidFileJson size={30} />, text: "JSON", action: "json" },
    { icon: <FaFilePdf size={30} />, text: "PDF", action: "pdf" },
  ];

  const toggleContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setContextMenuVisible(true);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const tabs = [
    "Профиль",
    "Оценка",
    "Аватарка",
    "Изображения",
    "Юзернейм",
    "Email",
    "Сменить пароль?",
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Профиль":
        return <div>Содержимое профиля</div>;
      case "Оценка":
        return <div>Содержимое оценки</div>;
      case "Аватарка":
        return <div>Содержимое аватарки</div>;
      case "Изображения":
        return <div>Содержимое изображений</div>;
      case "Юзернейм":
        return <div>Содержимое юзернейма</div>;
      case "Email":
        return <div>Содержимое email</div>;
      case "Сменить пароль?":
        return <div>Содержимое смены пароля</div>;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className="aside"
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="aside__header">
            <FiSidebar onClick={onClose} size={32} />
            <Link to="/">TasksHub</Link>
          </div>
          <nav>
            <ul className="aside__main">
              <li>
                <NavLink
                  to="/p"
                  end
                  className={({ isActive }: { isActive: boolean }) =>
                    isActive ? "active aside_nav" : "aside_nav"
                  }
                >
                  <AiFillProject size={30} />
                  Проекты
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/p/member"
                  end
                  className={({ isActive }: { isActive: boolean }) =>
                    isActive ? "active aside_nav" : "aside_nav"
                  }
                >
                  <BsPeopleFill size={30} />
                  Участники
                </NavLink>
              </li>
              <li onClick={toggleContextMenu}>
                <div className="context-menu-trigger">
                  <RiUploadCloudFill size={30} />
                  Выгрузить
                  {isContextMenuVisible && (
                    <ContextMenu
                      items={menuItems}
                      onClose={() => setContextMenuVisible(false)}
                    />
                  )}
                </div>
              </li>
              <li>
                <DropDown />
              </li>
            </ul>
          </nav>
          <div className="accaunt" onClick={toggleModal}>
            <div className="accaunt__wrapper">
              <img src="" alt="" className="avatar" />
              Nikita Tyushyakov
            </div>
          </div>
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={toggleModal}
              >
                <motion.div
                  className="modal-content"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2>Настройки</h2>
                  <button className="modal-close" onClick={toggleModal}>
                    ×
                  </button>
                  <div className="tabs">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        className={`tab ${activeTab === tab ? "active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="tab-content">{renderTabContent()}</div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Aside;

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { FiSidebar } from "react-icons/fi";
import { AiFillProject } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import { RiUploadCloudFill } from "react-icons/ri";
import { Link, NavLink } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa"
import { FaTimes, FaUser, FaCog } from "react-icons/fa";
import { BiSolidFileJson } from "react-icons/bi"

import DropDown from "../DropDown";
import ContextMenu from "../ContextMenu";

import "./Aside.scss";


type FullScreenModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

interface UserProfile {
  name: string;
  email: string;
  username: string;
}

const FullScreenModal: React.FC<FullScreenModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (activeTab === "profile") {
      // Заглушка: заменить на реальный запрос данных
      setProfileData({
        name: "Nikita Tyushyakov",
        email: "example@example.com",
        username: "NikitaT",
      });
    }
  }, [activeTab]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <motion.div className="modal-content">
            <button className="modal-close" onClick={onClose}>
              <FaTimes />
            </button>
            <h2>Настройки</h2>
            <div className="tabs">
              <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? "active btn" : "btn"}>
                <FaUser /> Профиль
              </button>
              <button onClick={() => setActiveTab("general")} className={activeTab === "general" ? "active btn" : "btn"}>
                <FaCog /> Общие
              </button>
            </div>
            <div className="content">
              {activeTab === "profile" ? (
                <div>
                  {profileData ? (
                    <form>
                      <div>ФИО: {profileData.name}</div>
                      <div>Email: {profileData.email}</div>
                      <div>Юзернейм: {profileData.username}</div>
                    </form>
                  ) : (
                    <p>Загрузка...</p>
                  )}
                </div>
              ) : (
                <form>
                  <p>Общие настройки (заглушка)</p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


interface IAside {
  isOpen: boolean;
  onClose: () => void;
}

const Aside: React.FC<IAside> = ({ isOpen, onClose }) => {
  const [isContextMenuVisible, setContextMenuVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems = [
    { icon: <BiSolidFileJson size={30} />, text: "JSON", action: "json" },
    { icon: <FaFilePdf size={30}/>, text: "PDF", action: "pdf" },
  ];

  const toggleContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setContextMenuVisible(true);
  };

  return (
    <>

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
                    {isContextMenuVisible && <ContextMenu items={menuItems} onClose={() => setContextMenuVisible(false)} />}
                  </div>
                </li>
                <li>
                  <DropDown />
                </li>
              </ul>
            </nav>
            <div className="accaunt">
              <div className="accaunt__wrapper" onClick={() => setIsModalOpen(true)}>
                <img src="" alt="" className="avatar" />
                Ждем инфу
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <FullScreenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Aside;

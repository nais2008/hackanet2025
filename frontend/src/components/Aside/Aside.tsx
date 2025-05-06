import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { FiSidebar } from "react-icons/fi";
import { AiFillProject } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import { RiUploadCloudFill } from "react-icons/ri";
import { Link, NavLink } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa"
import { BiSolidFileJson } from "react-icons/bi"

import DropDown from "../DropDown";
import ContextMenu from "../ContextMenu";

import "./Aside.scss";

interface IAside {
  isOpen: boolean;
  onClose: () => void;
}

const Aside: React.FC<IAside> = ({ isOpen, onClose }) => {
  const [isContextMenuVisible, setContextMenuVisible] = useState(false);

  const menuItems = [
    { icon: <BiSolidFileJson size={30} />, text: "JSON", action: "json" },
    { icon: <FaFilePdf size={30}/>, text: "PDF", action: "pdf" },
  ];

  const toggleContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setContextMenuVisible(true);
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
                  {isContextMenuVisible && <ContextMenu items={menuItems} onClose={() => setContextMenuVisible(false)} />}
                </div>
              </li>
              <li>
                <DropDown />
              </li>
            </ul>
          </nav>
          <div className="accaunt">
            <div className="accaunt__wrapper">
              <img src="" alt="" className="avatar" />
              Nikita Tyushyakov
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Aside;

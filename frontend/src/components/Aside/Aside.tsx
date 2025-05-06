import { motion, AnimatePresence } from "framer-motion"
import React from "react"
import { FiSidebar } from "react-icons/fi"
import { AiFillProject } from "react-icons/ai"
import { BsPeopleFill } from "react-icons/bs"
import { RiUploadCloudFill } from "react-icons/ri";
import { Link, NavLink } from "react-router-dom"

import DropDown from "../DropDowm"

import "./Aside.scss"

interface IAside {
  isOpen: boolean
  onClose: () => void
}

const Aside: React.FC<IAside> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      { isOpen && (
        <motion.aside
          className="aside"
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="aside__header">
            <FiSidebar onClick={ onClose } size={ 32 }/>
            <Link to="/">TasksHub</Link>
          </div>
          <nav>
            <ul className="aside__main">
              <li>
                <NavLink
                  to="/p"
                  end
                  className={({ isActive }: { isActive: boolean }) => (isActive ? "active aside_nav" : "aside_nav")}
                >
                  <AiFillProject size={30}/>
                  Проекты
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/p/member"
                  end
                  className={({ isActive }: { isActive: boolean }) => (isActive ? "active aside_nav" : "aside_nav")}
                >
                  <BsPeopleFill size={30} />
                  Участники
                </NavLink>
              </li>
              <li>
                <div>
                  <RiUploadCloudFill size={30}/>
                  Выгрузить
                </div>
              </li>
              <li>
                <DropDown />
              </li>
            </ul>
          </nav>
          <div className="account">
            <img src="" alt="" className="avatar" />
            Text
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default Aside

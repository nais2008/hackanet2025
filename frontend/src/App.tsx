import { motion, AnimatePresence } from "framer-motion"
import React from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import { FiSidebar } from "react-icons/fi"

import LoginPage from "./pages/LogInPage"
import SignUpPage from "./pages/SignUpPage"
import MainPage from "./pages/MainPage/MainPage"
import PageNotFound from "./pages/PageNotFound"
import ProjectIdPage from "./pages/ProjectIdPage"
import ProjectMemberPage from "./pages/ProjectMemberPage"
import ProjectPage from "./pages/ProjectPage"

import Aside from "./components/Aside"
import Footer from "./components/Footer"
import Header from "./components/Header"

import router from "./config/routes"

import "./App.scss"

function App() {
  const location = useLocation()
  const [ isAsideOpen, setIsAsideOpen ] = React.useState(true)

  const isProjectPage = () => {
    return /^\/p(\/.*)?$/.test(location.pathname)
  }
  const toggleAside = () => {
    setIsAsideOpen(!isAsideOpen)
  }

  return (
    <>
      {isProjectPage() ? <Aside isOpen={ isAsideOpen } onClose={ toggleAside } /> : <Header />}
      { (isProjectPage() && !isAsideOpen) && <FiSidebar onClick={ toggleAside } className="btn_open" size={ 32 }/> }
      <main>
        <AnimatePresence>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Routes>
              <Route path={ router.main.mask } element={ <MainPage /> } />
              <Route path={ router.login.mask } element={ <LoginPage /> } />
              <Route path={ router.signup.mask } element={ <SignUpPage /> } />
              <Route path={ router.project.mask } element={ <ProjectPage /> } />
              <Route path={ router.project_id.mask } element={ <ProjectIdPage /> } />
              <Route path={ router.project_member.mask } element={ <ProjectMemberPage /> } />
              <Route path={ router.page404.mask } element={ <PageNotFound /> } />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      { !isProjectPage() && <Footer />}
    </>
  )
}

export default App

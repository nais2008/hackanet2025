import { Routes, Route } from "react-router-dom"

import MainPage from "./pages/MainPage/MainPage"

import Header from "./components/Header"

import "./App.scss"

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={ <MainPage /> } />
        </Routes>
      </main>
    </>
  )
}

export default App

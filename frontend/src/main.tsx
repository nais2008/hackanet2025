import { BrowserRouter } from "react-router-dom"
import { createRoot } from "react-dom/client"

import App from "./App.tsx"

import "./config/configureMobX.ts"

import "./index.scss"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)

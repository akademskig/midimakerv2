import React from "react"
import "./App.css"
import { ThemeProvider } from "@mui/material/styles"
import theme from "./theme"
import AppRoutes from "./routes"
import { BrowserRouter as Router } from "react-router-dom"
import "./styles/index.scss"
import { AuthProvider } from "./providers"
import NotificationsProvider from "./providers/NotificationsProvider"

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <NotificationsProvider>
          <AuthProvider>
            <Router>
              <AppRoutes />
            </Router>
          </AuthProvider>
        </NotificationsProvider>
      </ThemeProvider>
    </div>
  )
}

export default App

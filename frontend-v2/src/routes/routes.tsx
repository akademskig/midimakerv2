import React, { memo } from "react"

import { Route, Routes } from "react-router-dom"
import MainLayout from "../components/layouts/MainLayout"
import MidiCollections from "../modules/midimaker/pages/MidiCollections"
import NewMidi from "../modules/midimaker/pages/NewMidi"
import AuthPage from "../pages/Auth.page"
import MainPage from "../pages/Main.page"
import SettingsPage from "../pages/Settings.page"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/*" element={<MainLayout />} />
    </Routes>
  )
}

export const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<MainPage />} />
      <Route path="/midimaker" element={<NewMidi/>}/>
      <Route path="/settings" element={<SettingsPage/>} />
      <Route path="/collections" element={<MidiCollections/>} />
      <Route path="/" element={<MainPage />} />
      <Route path="*" element={<div>Not found</div>} />
    </Routes>
  )
}

export default memo(AppRoutes)

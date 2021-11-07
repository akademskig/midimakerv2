import React from "react"
import SoundfontProvider from "../providers/SoundfontProvider/SoundfontProvider"
import AudioStateProvider from "../providers/AudioStateProvider/AudioStateProvider"
import AudioPlayerController from "../components/AudioPlayerController"
import AudioSettingsController from "../components/AudioSettingsController"
import ChannelsController from "../components/ChannelsController"
import NotesGridRenderer from "../components/NotesGrid/components/NotesGridRenderer"
import NotesGridControllerProvider from "../components/NotesGrid/components/NotesGridController"
const NewMidi = () => {
  return (
    <SoundfontProvider>
      <AudioStateProvider>
        <NotesGridControllerProvider>
          <AudioPlayerController top />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              flexGrow: 1,
              background: "#5d1c55",
            }}
          >
            <AudioSettingsController left />
            <NotesGridRenderer />
            <ChannelsController />
          </div>
          <AudioPlayerController />
        </NotesGridControllerProvider>
      </AudioStateProvider>
    </SoundfontProvider>
  )
}

export default NewMidi

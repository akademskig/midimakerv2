import { Pause, PlayArrow, Stop } from "@mui/icons-material"
import { ReactElement, useContext } from "react"
import classnames from "classnames"
import { useAudioPlayer } from "../../controllers/AudioPlayer"
import { AudioStateProviderContext } from "../../providers/AudioStateProvider/AudioStateProvider"
import { NotesGridControllerCtx } from "../NotesGrid/NotesGridController"
import FsController from "../FsController"
import {
  SContainer,
  SAudioButton,
  SAudioControlButtons,
  SFSControllerButtons,
} from "./AudioPlayerController.styles"

function AudioPlayerController({ top = false }): ReactElement {
  const { playAll, stopPlayAll } = useAudioPlayer()
  // const { renderPlay, stopPlayRender } = useContext(CanvasContext)
  const { setControllerState, controllerState } = useContext(
    AudioStateProviderContext
  )
  const { renderPlay, stopPlayRender, pausePlayRender } = useContext(
    NotesGridControllerCtx
  )

  const onPlayButtonClick = () => {
    if (controllerState.PLAYING) {
      return
    }
    playAll()
    renderPlay()
    setControllerState({ ...controllerState, PLAYING: true, PAUSED: false })
  }
  const onStopButtonClick = () => {
    stopPlayAll()
    stopPlayRender()
    setControllerState({ ...controllerState, PLAYING: false, PAUSED: false })
  }
  const onPauseButtonClick = () => {
    if (!controllerState.PLAYING) {
      return
    }
    pausePlayRender()
    stopPlayAll()
    setControllerState({ ...controllerState, PLAYING: false, PAUSED: true })
  }

  return (
    <SContainer>
      {top && (
        <>
          <SAudioControlButtons>
            <SAudioButton
              onClick={onPlayButtonClick}
              className={classnames({
                active: controllerState.PLAYING,
              })}
            >
              <PlayArrow />
            </SAudioButton>
            <SAudioButton
              onClick={onPauseButtonClick}
              className={classnames({
                active: controllerState.PAUSED,
              })}
            >
              <Pause />
            </SAudioButton>
            <SAudioButton onClick={onStopButtonClick}>
              <Stop />
            </SAudioButton>
          </SAudioControlButtons>
          <SFSControllerButtons>
            <FsController />
          </SFSControllerButtons>
        </>
      )}
    </SContainer>
  )
}

export default AudioPlayerController

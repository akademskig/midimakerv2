import { useCallback, useContext, useRef } from 'react'
import { uniq, flatMap } from 'lodash'
import { SoundfontProviderContext } from '../providers/SoundfontProvider/SoundfontProvider'
import {
  PlayEvent,
  TChannel,
  PlayChannelEvent
} from '../providers/SoundfontProvider/SoundFontProvider.types'
import { WindowExtended } from '../globals'
import { AudioStateProviderContext } from '../providers/AudioStateProvider/AudioStateProvider'
import { NotesGridControllerCtx } from '../components/NotesGrid/components/NotesGridController'

interface IAudioNode {
  play: () => unknown,
  stop: () => unknown
}

interface IActiveAudioNodes {
  [string: string]: IAudioNode | null
}

const windowExtended: WindowExtended = window
const audioContext = new (windowExtended && (windowExtended.AudioContext || windowExtended.webkitAudioContext))()

interface IAudioPlayer {
  playNote: (event: PlayEvent) => void;
  stopNote: (midiNumber: number) => void;
  startNote: (midiNumber: number) => void;
  playAll: () => void
  stopPlayAll: () => void,
  stopAllNotes: () => void
}
const scheduledEvents: Array<number> = []
function AudioPlayer(): IAudioPlayer {
  const activeAudioNodes = useRef<IActiveAudioNodes>({})
  const { cachedInstruments, currentInstrument } = useContext(SoundfontProviderContext)
  const { controllerState } = useContext(AudioStateProviderContext)
  const { channels } = useContext(AudioStateProviderContext)
  const { timer } = useContext(NotesGridControllerCtx)


  const startNote = useCallback(
    (event: any, instrumentName?: string) => {
        const audioNode = instrumentName
          ? cachedInstruments?.[instrumentName]?.start(event.midi.toString(), 0, {duration: event.duration})
          : currentInstrument?.player?.start(event.midi.toString(), 0,{duration: event.duration})
        if (audioNode) {
          activeAudioNodes.current = {
            ...activeAudioNodes.current,
            [event.midi]: audioNode,
          }
        }
    },
    [cachedInstruments, currentInstrument]
  )

  const stopNote = useCallback((midiNumber) => {
    const { current: audioNodes } = activeAudioNodes
      //@ts-ignore
      audioNodes && audioNodes[midiNumber] && audioNodes[midiNumber].stop()
      delete activeAudioNodes.current[midiNumber]
  }, [activeAudioNodes])

  const playNote = useCallback((lastEvent: PlayEvent, instrumentName?: string) => {
    startNote(lastEvent, instrumentName)
    setTimeout(() => {
      stopNote(lastEvent.midi)
    }, lastEvent.duration * 1000)
  }, [startNote, stopNote])

  const playAll = useCallback(
    async () => {
      if (controllerState.PLAYING) {
        return
      }
      let joinedEvents: PlayChannelEvent[] = []
      if (channels.length > 0) {
        joinedEvents = flatMap(channels.map((channel: TChannel) => {
          return channel.notes.map((note) => {
            return { ...note, ...{ instrumentName: channel.instrumentName } }
          })
        }))
      }
      const startAndEndTimes = uniq(
        flatMap(joinedEvents, (event) => [
          event.time -= timer,
          Math.floor(event.time + event.duration - timer),
        ]).filter(time => time >= 0)
      )
      startAndEndTimes.forEach((time, i) => {
        scheduledEvents.push(
          setTimeout(() => {
            const currentEvents = joinedEvents.filter((event: PlayEvent) => {
              return (event.time <= time && event.time + event.duration > time)
            })
            currentEvents.forEach((currentEvent: PlayChannelEvent) => {
              playNote(currentEvent, currentEvent.instrumentName)
            })
          }, time * 1000)
        )
      })
    },
    [channels, controllerState.PLAYING, playNote, timer]
  )

  // Clear any residual notes that don't get called with stopNote
  const stopAllNotes = useCallback(() => {
    audioContext.resume().then(() => {
      const activeAudioNodesValues = Object.values(
        activeAudioNodes.current || {}
      )
      activeAudioNodesValues.forEach((node) => {
        if (node) {
          node.stop()
        }
      })
      activeAudioNodes.current = {}
    })
  }, [activeAudioNodes])

  const stopPlayAll = useCallback(() => {
    scheduledEvents.forEach((scheduledEventId) => {
      clearTimeout(scheduledEventId)
    })
    stopAllNotes()
  }, [stopAllNotes])

  

  // channelsToPlaylist = async (channels) => {
  //   channels.forEach(async c => {
  //     this.instruments[c.instrumentName] = await this.loadChannelInstrument(c.instrumentName)
  //   })
  // }

  return {
    playAll,
    stopPlayAll,
    playNote,
    stopNote,
    stopAllNotes,
    startNote,
  }
}

function useAudioPlayer(): IAudioPlayer {
  return AudioPlayer()
}

export default AudioPlayer
export { useAudioPlayer }

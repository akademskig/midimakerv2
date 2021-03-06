import React, {
  createContext,
  useCallback,
  useState,
  useEffect,
  useMemo,
  ReactElement,
} from "react"
import Soundfont from "soundfont-player"
import appConfig from "../../config"
import {
  SoundfontProviderContextValue,
  SoundfontFormat,
  SoundfontType,
  ICachedInstruments,
  TCurrentInstrument,
} from "./SoundFontProvider.types"
import { audioContext } from "../../globals"
import { instrumentList } from "./soundfontInstruments"

const hostname = appConfig.soundfont.hostname

export type SoundfontProviderProps = {
  format: SoundfontFormat
  soundfont: SoundfontType
  children: ReactElement
}

const initialCtxValue = {
  currentInstrument: {
    name: "",
    player: null,
  },
  loadInstrument: () => new Promise((resolve) => resolve(null)),
  loading: true,
  cachedInstruments: {},
  currentInstrumentName: "",
  setCurrentInstrumentName:
    (value: React.SetStateAction<string>) => (value: string) =>
      value,
}
let cachedInstrumentsLocal: ICachedInstruments = {}
export const SoundfontProviderContext =
  createContext<SoundfontProviderContextValue>(initialCtxValue)
function SoundfontProvider({
  format = SoundfontFormat.mp3,
  soundfont = SoundfontType.MusingKyte,
  children,
}: SoundfontProviderProps): JSX.Element {
  const [currentInstrumentName, setCurrentInstrumentName] = useState(
    instrumentList[2]
  )
  const [currentInstrument, setCurrentInstrument] =
    useState<TCurrentInstrument | null>(null)
  const [cachedInstruments, setCachedInstruments] =
    useState<ICachedInstruments>({})
  const [loading, setLoading] = useState<boolean>(false)

  const fetchInstrument = useCallback(
    async (instrumentName) => {
      let instrument = null
      try {
        instrument = await Soundfont.instrument(audioContext, instrumentName, {
          format,
          soundfont,
          nameToUrl: (name: string, soundfont: string, format: string) =>
            `${hostname}/${soundfont}/${name}-${format}.js`,
        })
      } catch (error) {
        console.error(error)
      }
      return instrument
    },
    [format, soundfont]
  )

  const loadInstrument = useCallback(
    async (instrumentName: string, setCurrent?: boolean) => {
      setLoading(true)
      setCurrentInstrument(null)
      if (cachedInstruments?.[instrumentName]) {
        setCurrent &&
          setCurrentInstrument({
            name: instrumentName,
            player: cachedInstruments?.[instrumentName],
          })
        return setLoading(false)
      }
      let instrument = null
      try {
        instrument = await fetchInstrument(instrumentName)
      } catch (error) {
        return console.error(`Unable to fetch instrument ${instrumentName}`)
      }
      setCurrent &&
        setCurrentInstrument({
          name: instrumentName,
          player: instrument,
        })
      if (instrument) {
        cachedInstrumentsLocal = {
          ...cachedInstrumentsLocal,
          [instrumentName]: instrument,
        }
        setCachedInstruments({
          ...cachedInstrumentsLocal,
          [instrumentName]: instrument,
        })
      }
      setLoading(false)
    },
    [cachedInstruments, fetchInstrument]
  )
  useEffect(() => {
    loadInstrument(currentInstrumentName, true)
  }, [currentInstrumentName, loadInstrument, setCurrentInstrument])
  const ctxValue = useMemo(
    () => ({
      currentInstrument,
      cachedInstruments,
      loadInstrument,
      setCurrentInstrumentName,
      currentInstrumentName,
      loading: !currentInstrument || loading,
    }),
    [
      currentInstrument,
      cachedInstruments,
      loadInstrument,
      currentInstrumentName,
      loading,
    ]
  )
  return (
    <SoundfontProviderContext.Provider value={ctxValue}>
      {children}
    </SoundfontProviderContext.Provider>
  )
}

SoundfontProvider.defaultProps = appConfig.soundFontDefaults

export default SoundfontProvider

import { RefObject } from "react"
import { instrumentList } from "../../providers/SoundfontProvider/soundfontInstruments"

export const getInstrumentLabel = (instrument: string) => {
  return (
    instrument.charAt(0).toUpperCase() +
    instrument.slice(1).split("_").join(" ")
  )
}
export const makeInstrumentList = () => {
  return instrumentList.map((instrument) => ({
    value: instrument,
    label: getInstrumentLabel(instrument),
  }))
}
export const isClickedOutside = (e: any, ref: RefObject<any>) => {
  if(!ref.current){
    return true
  }
  const coords = ref?.current?.getBoundingClientRect()
  if (coords) {
    const { top, right, bottom, left } = coords
    if (
      (e.clientX < left || e.clientX > right) ||
      (e.clientY < top || e.clientY > bottom)
    ) {
      return true
    }
  }
  return false
}

import { instrumentList } from "../../providers/SoundfontProvider/soundfontInstruments"

export const getInstrumentLabel = (instrument: string)=> {
    return instrument.charAt(0).toUpperCase() + instrument.slice(1).split('_').join(' ')
}
export const makeInstrumentList = () => {
    return instrumentList.map(instrument=> ({
        value: instrument,
        label: getInstrumentLabel(instrument)
    }))
}

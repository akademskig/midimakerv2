export const getInstrumentLabel = (instrument: string)=> {
    return instrument.charAt(0).toUpperCase() + instrument.slice(1).split('_').join(' ')
}
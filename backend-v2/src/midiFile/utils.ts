export const getInstrumentLabel = (instrument: string) => {
    return instrument.charAt(0).toUpperCase() + instrument.slice(1).split('_').join(' ')
}
export const parseChannelName = (channelName: string) => {
    return channelName.replace(/[\(\)]/g, '').toLocaleLowerCase().split(' ').join('_')
}

export const parseFilename = (filename: string) => {
    return filename.replace(/[\(\)]/g, '').split(' ').join('_')
}
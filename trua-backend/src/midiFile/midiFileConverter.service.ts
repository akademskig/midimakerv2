import { Injectable, Logger } from '@nestjs/common';
import MidiFile from 'src/database/entity/midiFile.entity';
import { Midi } from "@tonejs/midi"
import * as fs from 'fs'
import { instrumentNumbers } from './data/instrument_numbers';
import { getInstrumentLabel } from './utils';

@Injectable()
export class MidiFileConverterService {
    constructor(

    ) { }

    async convertFromMidi(midiFile: MidiFile, ext: string) {
        const midi = await this.encodeMidi(midiFile.midiChannels)
        console.log(midi)
        let filename = `${process.cwd()}/midis/${midiFile.name.replace(/\s/g, "")}`
        fs.writeFileSync(filename + ".mid", Buffer.from(midi.toArray()))
        await this.timidityConvertFromMidi(filename, ext)
        return `${filename}.${ext}`
    }
    async convertToMidi(file: any) {
        let filenameRaw = `${process.cwd()}/midis/${file.originalname.replace(/\s/g, "")}`
        const filename = filenameRaw.split('.')[0]
        const ext = filenameRaw.split('.')[1]
        try {
            fs.statSync(`${filename}.${ext}`)
        }
        catch (error) {
            fs.writeFileSync(`${filename}.${ext}`, file.buffer)
        }
        try {
            fs.statSync(`${filename}.${'wav'}`)
        }
        catch (error) {
            await this.ffmpegConvertAny(filename, 'mp3', 'wav')
        }
        const midiFilename = `${filename}.${'mid'}`
        try {
            fs.statSync(midiFilename)
        }
        catch (error) {
            await this.convertWavToMidi(filename)
        }
        const midiData = fs.readFileSync(midiFilename)
        return await this.decodeMidi(midiData)
    }

    async convertWavToMidi(filename) {
        return new Promise((resolve, reject) => {
            const { exec } = require('child_process');
            exec(`./waon -i ${filename}.wav -o ${filename}.mid`, (err: Error, stdout: any, stderr: any) => {
                if (err) {
                    console.error(err)
                    reject(err)
                    return
                }
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                resolve(`${filename}.mid`)
            });
        })
    }
    async encodeMidi(midiChannels) {
        var midi = new Midi()
        midiChannels.forEach((channel, i) => {
            const iNum = this.getInstrumentNumber(channel.instrumentName)
            if (iNum == null) {
                console.log(`Number not found for instrument ${channel.instrumentName}.`)
                return
            }
            const track = midi.addTrack()
            track.instrument.number = iNum
            track.name = channel.instrumentName
            track.channel = i

            channel.notes.forEach((mt: any) => {
                track.addNote({
                    midi: mt.midi,
                    time: mt.time,
                    duration: mt.duration
                })
            })
        })
        return midi
    }
    async decodeMidi(midiData) {
        const midi = new Midi(midiData)
        const channels = midi.tracks.map(track => {
            return {
                instrumentName: track.instrument.name.split(' ').join('_'),
                notes: track.notes,
                //@ts-ignore
                duration: track.duration
            }
        })
        return channels
    }
    getInstrumentNumber(instrument: string) {
        const formatted = getInstrumentLabel(instrument)
        const { instruments } = instrumentNumbers
        return instruments.findIndex(({ instrument }) => instrument.toLowerCase() === formatted.toLocaleLowerCase())
    }
    async timidityConvertFromMidi(file: string, extOut: string) {
        return new Promise((resolve, reject) => {
            const { exec } = require('child_process');
            exec(`timidity -Ow -o - ${file}.mid | lame -  ${file}.${extOut}`, (err: Error, stdout: any, stderr: any) => {
                if (err) {
                    console.error(err)
                    reject(err)
                    return
                }
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                resolve('done')
            });
        })
    }
    async ffmpegConvertAny(file: string, extIn: string, extOut: string) {
        return new Promise((resolve, reject) => {
            const { exec } = require('child_process');
            exec(`ffmpeg -i ${file}.${extIn} -acodec pcm_u8 -ar 22050 ${file}.${extOut}`, (err: Error, stdout: any, stderr: any) => {
                if (err) {
                    console.error(err)
                    reject(err)
                    return
                }
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                resolve(`${file}.${extOut}`)
            });
        })
    }
}
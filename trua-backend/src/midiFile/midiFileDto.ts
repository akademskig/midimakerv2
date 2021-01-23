import { IsNotEmpty } from 'class-validator';

export default class MidiFileDto {

    @IsNotEmpty()
    name: string;

    midiFile?: JSON;

    @IsNotEmpty()
    midiChannels: JSON ;

    canvasImgBlob: Blob ;

    constructor(midiFileDto){
        if(!midiFileDto){
            return this
        }
        const { name, midiChannels, midiFile, canvasImgBlob } = midiFileDto
        this.name = name
        this.midiChannels = midiChannels
        this.midiFile = midiFile && midiFile
        this.canvasImgBlob = canvasImgBlob
    }
}

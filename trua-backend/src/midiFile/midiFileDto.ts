import { IsNotEmpty } from 'class-validator';
import MidiFile from 'src/database/entity/midiFile.entity';

export default class MidiFileDto {

    @IsNotEmpty()
    name: string;

    midiFile?: JSON;

    @IsNotEmpty()
    midiChannels: Array<JSON> ;

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

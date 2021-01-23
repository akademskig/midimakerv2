import {
    Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import User from './user.entity';

@Entity()
export default class MidiFile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @IsNotEmpty()
    @Column({ length: 500 })
    name: string;

    @Column('json', { nullable: true})
    midiFile?: JSON ;

    @IsNotEmpty()
    @Column('json')
    midiChannels: JSON[] ;

    @Column({name: 'imageData',type: 'bytea', nullable: true})
    canvasImgBlob?: Buffer ;

    @ManyToOne(type => User)
    @JoinColumn()
    owner: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(midiFileInput){
        if(!midiFileInput){
            return this
        }

        const { name, midiChannels, midiFile, userId, canvasImgBlob} = midiFileInput
        this.name = name
        this.midiChannels = midiChannels
        this.owner = userId
        this.midiFile = midiFile && midiFile
        this.canvasImgBlob = canvasImgBlob &&canvasImgBlob
    }
}

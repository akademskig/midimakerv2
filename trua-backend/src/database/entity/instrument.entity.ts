import {
    Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity()
export default class Instrument {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @IsNotEmpty()
    @Column({ length: 500 })
    name: string;

    @IsNotEmpty()
    @Column()
    player: BinaryType;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(instrument) {
        if (!instrument) {
            return this;
        }
        const { name, player } = instrument;
        this.name = name;
        this.player = player;
    }
}

import {
    Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
    OneToOne, JoinColumn, TableForeignKey, ManyToOne, ManyToMany,
} from 'typeorm';
import User from './user.entity';
import Location from './location.entity';
import { OneToMany } from 'typeorm';

@Entity()
export default class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 500 })
    name: string;

    @OneToOne(type => Location)
    @JoinColumn()
    location: Location;

    @Column('timestamp')
    startTime: Date;

    @Column('timestamp')
    endTime: Date;

    @ManyToOne(type => User)
    @JoinColumn()
    owner: User;

    @ManyToMany(type => User)
    @JoinColumn()
    participants: User[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(event) {
        if (!event) {
            return this;
        }
        const { name, location, startTime, endTime, duration } = event;
        this.name = name;
        this.location = location;
        this.startTime = startTime;
        if (endTime) {
            this.endTime = endTime;
        } else if (duration) {
            this.endTime = startTime + duration;
        }
    }
}

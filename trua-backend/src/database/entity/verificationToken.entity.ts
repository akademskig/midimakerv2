import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Timestamp, JoinColumn, OneToOne, AfterInsert } from 'typeorm';

@Entity()
export default class VerificationToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    token: string;

    @Column()
    duration: number;

    @CreateDateColumn()
    createdAt: Timestamp;

    constructor(data) {
        if (!data) {
            return this;
        }
        const { token, duration } = data;
        this.token = token;
        this.duration = duration;
    }
}

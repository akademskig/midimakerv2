import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Timestamp, OneToOne, JoinColumn } from 'typeorm';
import { UserRoles } from '../../users/types/types';
import { IsEmail, Length } from 'class-validator';
import VerificationToken from './verificationToken.entity';

@Entity()
export default class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 500, unique: true })
    username: string;

    @Length(8)
    @Column('text')
    password: string;

    @IsEmail()
    @Column({ type: 'text', unique: true })
    email: string;

    @Column({
        type: 'enum',
        enum: UserRoles,
        default: UserRoles.REGULAR,
    })
    role: UserRoles;

    @Column({ type: 'text', nullable: true })
    company: string;

    @OneToOne(type => VerificationToken, {cascade: true})
    @JoinColumn()
    verificationToken: string;

    @Column({ type: Boolean, default: false })
    isVerified: boolean;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    constructor(user) {
        if (!user) {
            return this;
        }
        const { username, email, password, verificationTokenId } = user;
        this.username = username;
        this.email = email;
        this.verificationToken = verificationTokenId;
        this.password = password;
    }
}

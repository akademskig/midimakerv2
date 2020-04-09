import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoles } from './types';
import { IsEmail, Length } from 'class-validator';

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
        default: UserRoles.ADMIN,
    })
    role: UserRoles;

    @Column({ type: 'text', nullable: true })
    company: string;

    constructor(user) {
        if (!user) {
            return this;
        }
        const { username, email, password } = user;
        this.username = username;
        this.email = email;
        this.password = password;
    }
}

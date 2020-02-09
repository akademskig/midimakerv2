import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Privileges } from './types';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Entity()
export default class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 500, unique: true })
    username: string;

    @Column('text')
    password: string;

    @IsEmail()
    @Column({type: 'text', unique: true})
    email: string;

    @IsNotEmpty()
    @Column({
        type: 'enum',
        enum: Privileges,
        default: Privileges.ADMIN,
    })
    privilege: Privileges;

    @IsNotEmpty()
    @Column({
        type: 'enum',
        enum: Privileges,
        default: Privileges.ADMIN,
    })
    type: Privileges;

    @Column({type: 'text', nullable: true})
    company: string;

    constructor(user) {
        if (!user) {
            return this;
        }
        const { username, email, password, type } = user;
        this.username = username;
        this.email = email;
        this.password = password;
        if (type) {
            this.type = type;
        } else {
            this.type = Privileges.ADMIN;
        }
        this.privilege = Privileges.ADMIN;
    }
}

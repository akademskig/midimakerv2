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
    @Column('text')
    email: string;

    @IsNotEmpty()
    @Column({ enum: [Privileges.ADMIN, Privileges.COMPANY, Privileges.REGULAR] })
    privilege: Privileges;

    @IsNotEmpty()
    @Column({ enum: [Privileges.ADMIN, Privileges.COMPANY, Privileges.REGULAR] })
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

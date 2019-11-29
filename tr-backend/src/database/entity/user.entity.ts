import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Privileges } from './types';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    username: string;

    @Column('text')
    password: string;

    @Column({ enum: [Privileges.ADMIN, Privileges.COMPANY, Privileges.REGULAR] })
    privilege: 'enum';

    @Column({ enum: [Privileges.ADMIN, Privileges.COMPANY, Privileges.REGULAR] })
    type: 'enum';

    @Column('text')
    company: string;
}


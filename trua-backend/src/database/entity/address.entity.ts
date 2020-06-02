import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Timestamp, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export default class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 500 })
    streetName: string;

    @Column()
    streetNumber: string;

    @Column('text')
    city: string;

    @Column('text')
    country: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(address) {
        if (!address) {
            return this;
        }
        const { streetName, streetNumber, city, country } = address;
        this.streetName = streetName;
        this.streetNumber = streetNumber;
        this.city = city;
        this.country = country;
    }
}

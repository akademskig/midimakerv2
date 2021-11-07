import {
    Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
    Timestamp, OneToOne, JoinColumn, TableForeignKey,
} from 'typeorm';

@Entity()
export default class Location {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 500 })
    name: string;

    @Column('decimal')
    latitude: number;

    @Column('decimal')
    longitude: number;

    @Column({ type: 'text', nullable: true })
    street: string;

    @Column({ type: 'text', nullable: true })
    city: string;

    @Column({ type: 'text', nullable: true })
    country: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(location) {
        if (!location) {
            return this;
        }
        const { name, latitude, longitude, city, country, street } = location;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.city = city;
        this.country = country;
        this.street = street;
    }
}

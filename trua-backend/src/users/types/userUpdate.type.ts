import { IsEmail, Length, IsEnum, IsEmpty, IsOptional } from 'class-validator';
import { UserRoles } from './types';

export default class UserUpdate {
    id: string;

    @Length(3, 500)
    username: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsEnum(UserRoles)
    role: UserRoles;

    @IsOptional()
    company: string;

    constructor(user) {
        const { username, email } = user;
        this.username = username;
        this.email = email;
    }
}

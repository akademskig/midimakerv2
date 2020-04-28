import { IsEmail, Length, IsEnum, IsOptional } from 'class-validator';
import { UserRoles } from './types';

export default class UserUpdate {
    id?: string;
    @IsOptional()
    @Length(3, 500)
    username?: string;
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsEnum(UserRoles)
    role?: UserRoles;

    @IsOptional()
    password?: string;

    @IsOptional()
    company?: string;

    @IsOptional()
    isVerified: boolean;

    constructor(user) {
        const { username, email, isVerified, password } = user;
        if (username) {
        this.username = username ;
        }
        if (email) {
        this.email = email ;
        }
        if (isVerified) {
        this.isVerified = isVerified;
        }
        if (password) {
        this.password = password;
        }
    }
}

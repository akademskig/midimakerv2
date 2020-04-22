import { IsEmail, Length, IsEnum, IsEmpty, IsOptional } from 'class-validator';
import { UserRoles } from './types';
import VerificationToken from '../../database/entity/verificationToken.entity';

export default class UserUpdate {
    id: string;
    @IsOptional()
    @Length(3, 500)
    username: string;
    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsEnum(UserRoles)
    role: UserRoles;

    @IsOptional()
    tokenId: string;

    @IsOptional()
    company: string;

    constructor(user) {
        const { username, email, token } = user;
        this.username = username;
        this.email = email;
        this.tokenId = token
    }
}

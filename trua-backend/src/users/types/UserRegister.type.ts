import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserRegister {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @MinLength(8,
        { message: 'Password must be at least 8 characters in length.' })
    password: string;

    @IsNotEmpty()
    verificationTokenId?: string;
}

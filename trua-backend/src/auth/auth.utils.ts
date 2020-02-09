import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';
import * as bcrypt from 'bcrypt';

export class UserRegister {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(6,
    { message: 'Password must be at least 6 characters in length.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&])/,
    { message: 'Password must contain at least 1 lowercase and 1 uppercase letter, at least 1 number and a special character.' })
  password: string;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

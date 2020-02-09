import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';
import * as bcrypt from 'bcrypt';

export class UserRegister {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{6,15}$/)
  password: string;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePasswords(password: string, hashedPassword): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

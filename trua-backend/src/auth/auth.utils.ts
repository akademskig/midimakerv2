import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';


@Injectable()
export class AuthUtils {
  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  comparePasswords({ password, hashedPassword }: { password: string; hashedPassword: string; }): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}


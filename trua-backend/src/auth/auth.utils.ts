import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import VerificationToken from '../database/entity/verificationToken.entity';
import { Repository, QueryRunner } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthUtils {

  constructor(
    @InjectRepository(VerificationToken)
    private readonly tokenRepository: Repository<VerificationToken>) { }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  comparePasswords({ password, hashedPassword }: { password: string; hashedPassword: string; }): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async createVerificationToken(userData, queryRunner: QueryRunner) {
    const token = new VerificationToken({
      token: bcrypt.hashSync(userData, 10),
      duration: 86400000, // 1 day
    });
    return queryRunner.manager.save(token);
  }
}

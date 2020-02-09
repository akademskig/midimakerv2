import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRegister, hashPassword } from 'src/auth/auth.utils';
import { getRepository, Repository } from 'typeorm';
import User from 'src/database/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ username });
  }

  async createNew({ username, password, email }: UserRegister): Promise<User> {
    const existingUser = await this.findOne(username);
    if (existingUser) {
      throw new BadRequestException(`Username ${existingUser.username} already exists!`);
    }
    const hashedPassword = await hashPassword(password);
    const user = new User({ username, password: hashedPassword, email });
    const errors = await validate(user);
    if (errors.length) {
      throw errors;
    }
    return this.userRepository.save(user);
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository, QueryRunner } from 'typeorm';
import User from '../database/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { QueryBuilderService } from '../utils/queryBuilder.service';
import ValidationErrors from '../errors/ValidationErrors';
import UserUpdate from './types/userUpdate.type';
import { AuthUtils } from '../auth/auth.utils';
import { UserRegister } from './types/UserRegister.type';

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly qbs: QueryBuilderService,
    private readonly authUtils: AuthUtils,
  ) { }

  async findOne(query): Promise<User | undefined> {
    return this.userRepository.findOne(query);
  }

  async getAll(params): Promise<{ data: User[], count: number }> {
    const query = this.qbs.buildQuery(params, 'User');
    const res = await this.userRepository.findAndCount(query);
    const data = res[0];
    const count = res[1];
    return { data, count };
  }

  async createNew({ username, password, email }: UserRegister, queryRunner?: QueryRunner): Promise<User> {
    const existingUser = await this.findOne({ username });
    if (existingUser) {
      throw new BadRequestException(`Username ${existingUser.username} already exists!`);
    }
    const existingEmail = await this.findOne({ email });
    if (existingEmail) {
      throw new BadRequestException(`Email ${existingEmail.email} already exists!`);
    }
    const hashedPassword = await this.authUtils.hashPassword(password);
    const user = new User({ username, password, email });
    const errors = await validate(user);
    user.password = hashedPassword;
    if (errors.length) {
      throw new ValidationErrors(errors);
    }
    if (queryRunner) {
      return queryRunner.manager.save(user);
    }
    return this.userRepository.save(user);
  }
  async updateOne(query: { id?: string, email?: string }, userData: UserUpdate) {
    const user = new UserUpdate(userData);
    const errors = await validate(user);
    if (errors.length) {
      throw new ValidationErrors(errors);
    }
    const { id: extractedId, ...userValues } = user;
    await this.userRepository.update(query, userValues);
    return this.findOne(query);
  }
  async deleteById(id) {
    return this.userRepository.remove(id);
  }
}

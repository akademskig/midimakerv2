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

  async findOne(query): Promise<User | undefined> {
    return this.userRepository.findOne(query);
  }

  async getAll(params): Promise<{data:User[], count: number}> {
    const query = this.buildQuery(params);
    const res = await this.userRepository.findAndCount(query);
    const count= res[1]
    const data = res[0]
    return {data, count}

  }

  private buildQuery(params: any) {
    const { _end, _start, _sort, _order } = params;
    const order = {
      [_sort]: _order,
    };
    const select = {
      skip: _start,
      take: _end,
    };
    const query = {
      order,
      ...select,
    };
    return query;
  }

  async createNew({ username, password, email }: UserRegister): Promise<User> {
    const existingUser = await this.findOne({username});
    if (existingUser) {
      throw new BadRequestException(`Username ${existingUser.username} already exists!`);
    }
    const existingEmail = await this.findOne({email});
    if (existingEmail) {
      throw new BadRequestException(`Email ${existingEmail.email} already exists!`);
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

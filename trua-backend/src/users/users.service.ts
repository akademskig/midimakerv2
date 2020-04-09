import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRegister, hashPassword } from 'src/auth/auth.utils';
import { Repository } from 'typeorm';
import User from 'src/database/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { QueryBuilderService } from 'src/utils/queryBuilder.service';
import ValidationErrors from '../errors/ValidationErrors';

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly qbs: QueryBuilderService,
  ) { }

  async findOne(query): Promise<User | undefined> {
    return this.userRepository.findOne(query);
  }

  async getAll(params): Promise<{data: User[], count: number}> {
    const query = this.qbs.buildQuery(params, 'User');
    const res = await this.userRepository.findAndCount(query);
    const data = res[0];
    const count = res[1];
    return {data, count};
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
      throw new ValidationErrors(errors);
    }
    return this.userRepository.save(user);
  }
  async updateOne(id: {id: string}, user: User) {
    const {id: extractedId, ...userValues} = user;
    return this.userRepository.update(id, userValues);
  }

  async deleteById(id) {
    return this.userRepository.remove(id);
  }
}

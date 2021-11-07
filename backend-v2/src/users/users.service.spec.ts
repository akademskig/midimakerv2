import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import User from '../database/entity/user.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { QueryBuilderService } from '../utils/queryBuilder.service';
import { AuthUtils } from '../auth/auth.utils';
import DBConnection from '../database';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthUtils, UsersService, QueryBuilderService,  {
        provide: getRepositoryToken(User),
        useValue: 'UserRepository',
      }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

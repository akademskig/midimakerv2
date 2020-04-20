import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthUtils } from '../auth/auth.utils';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import User from '../database/entity/user.entity';
import { QueryBuilderService } from '../utils/queryBuilder.service';

describe('Users Controller', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthUtils, UsersService, QueryBuilderService,  {
        provide: getRepositoryToken(User),
        useValue: 'UserRepository',
      }],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});


import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import User from '../database/entity/user.entity';
import { QueryBuilderService } from '../utils/queryBuilder.service';
import { AuthUtils } from '../auth/auth.utils';
import VerificationToken from '../database/entity/verificationToken.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, VerificationToken])],
  providers: [AuthUtils, UsersService, QueryBuilderService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

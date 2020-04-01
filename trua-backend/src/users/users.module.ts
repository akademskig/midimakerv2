
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/database/entity/user.entity';
import { QueryBuilderService } from 'src/utils/queryBuilder.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, QueryBuilderService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LoggerModule } from '../logger/logger.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [LoggerModule],
  exports: [UsersService],
})
export class UsersModule {}

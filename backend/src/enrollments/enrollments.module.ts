import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { LoggerModule } from '../common/logger/logger.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  imports: [LoggerModule, UsersModule],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}

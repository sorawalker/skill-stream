import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { LoggerModule } from '../common/logger/logger.module';
import { UsersModule } from '../users/users.module';
import { EnrollmentsModule } from '../enrollments/enrollments.module';

@Module({
  controllers: [LessonsController],
  providers: [LessonsService],
  imports: [LoggerModule, UsersModule, EnrollmentsModule],
  exports: [LessonsService],
})
export class LessonsModule {}

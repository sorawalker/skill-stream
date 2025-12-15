import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { LoggerModule } from '../common/logger/logger.module';

@Module({
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  imports: [LoggerModule],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}

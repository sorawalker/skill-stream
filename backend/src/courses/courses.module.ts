import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { LoggerModule } from '../common/logger/logger.module';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [LoggerModule],
  exports: [CoursesService],
})
export class CoursesModule {}

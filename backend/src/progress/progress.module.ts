import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { LoggerModule } from '../common/logger/logger.module';

@Module({
  controllers: [ProgressController],
  providers: [ProgressService],
  imports: [LoggerModule],
  exports: [ProgressService],
})
export class ProgressModule {}

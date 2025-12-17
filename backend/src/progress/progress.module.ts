import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { LoggerModule } from '../common/logger/logger.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Module({
  controllers: [ProgressController],
  providers: [ProgressService, JwtAuthGuard],
  imports: [LoggerModule, AuthModule, UsersModule],
  exports: [ProgressService],
})
export class ProgressModule {}

import { forwardRef, Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { LoggerModule } from '../common/logger/logger.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Module({
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService, JwtAuthGuard],
  imports: [
    LoggerModule,
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
  ],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}

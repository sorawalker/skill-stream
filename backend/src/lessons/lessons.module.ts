import { forwardRef, Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { LoggerModule } from '../common/logger/logger.module';
import { UsersModule } from '../users/users.module';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { EnrollmentGuard } from '../auth/guards/enrollment.guard';

@Module({
  controllers: [LessonsController],
  providers: [LessonsService, JwtAuthGuard, RolesGuard, EnrollmentGuard],
  imports: [
    LoggerModule,
    forwardRef(() => UsersModule),
    forwardRef(() => EnrollmentsModule),
    forwardRef(() => AuthModule),
  ],
  exports: [LessonsService],
})
export class LessonsModule {}

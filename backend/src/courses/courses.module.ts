import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { LoggerModule } from '../common/logger/logger.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService, JwtAuthGuard, RolesGuard],
  imports: [LoggerModule, UsersModule, AuthModule],
  exports: [CoursesService],
})
export class CoursesModule {}

import { Module } from '@nestjs/common';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { PrismaModule } from '../repositories/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { LoggerModule } from '../common/logger/logger.module';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [LoggerModule, PrismaModule, UsersModule, AuthModule],
  controllers: [QuizzesController],
  providers: [QuizzesService, JwtAuthGuard, RolesGuard],
  exports: [QuizzesService],
})
export class QuizzesModule {}

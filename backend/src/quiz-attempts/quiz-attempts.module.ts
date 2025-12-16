import { Module } from '@nestjs/common';
import { QuizAttemptsController } from './quiz-attempts.controller';
import { QuizAttemptsService } from './quiz-attempts.service';
import { PrismaModule } from '../repositories/prisma/prisma.module';
import { QuizzesModule } from '../quizzes/quizzes.module';
import { UsersModule } from 'src/users/users.module';
import { LoggerModule } from '../common/logger/logger.module';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Module({
  imports: [LoggerModule, PrismaModule, QuizzesModule, UsersModule, AuthModule],
  controllers: [QuizAttemptsController],
  providers: [QuizAttemptsService, JwtAuthGuard],
  exports: [QuizAttemptsService],
})
export class QuizAttemptsModule {}

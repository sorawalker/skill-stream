import { Module } from '@nestjs/common';
import { QuizAttemptsController } from './quiz-attempts.controller';
import { QuizAttemptsService } from './quiz-attempts.service';
import { PrismaModule } from '../repositories/prisma/prisma.module';
import { QuizzesModule } from '../quizzes/quizzes.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, QuizzesModule, UsersModule],
  controllers: [QuizAttemptsController],
  providers: [QuizAttemptsService],
  exports: [QuizAttemptsService],
})
export class QuizAttemptsModule {}

import { Module } from '@nestjs/common';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { PrismaModule } from '../repositories/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { LoggerModule } from '../common/logger/logger.module';

@Module({
  imports: [LoggerModule, PrismaModule, UsersModule],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}

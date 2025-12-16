import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QuizAttemptAnswerDto {
  @IsNotEmpty()
  question: string;

  @IsNotEmpty()
  answer: string;
}

export class CreateQuizAttemptDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuizAttemptAnswerDto)
  answers: QuizAttemptAnswerDto[];
}

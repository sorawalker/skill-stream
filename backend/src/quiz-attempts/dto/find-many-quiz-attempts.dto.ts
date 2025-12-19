import { IsOptional, IsPositive, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class FindManyQuizAttemptsDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit: number = 10;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  order: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsString()
  @IsIn(['id', 'attemptedAt', 'score'])
  sortBy: 'id' | 'attemptedAt' | 'score' = 'attemptedAt';
}

import { IsOptional, IsPositive, IsString, IsIn } from 'class-validator';

export class FindManyEnrollmentsDto {
  @IsOptional()
  @IsPositive()
  page: number = 1;

  @IsOptional()
  @IsPositive()
  limit: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  order: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsString()
  @IsIn(['id', 'enrolledAt', 'completed', 'progress'])
  sortBy: 'id' | 'enrolledAt' | 'completed' | 'progress' = 'enrolledAt';
}

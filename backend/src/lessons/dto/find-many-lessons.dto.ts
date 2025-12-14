import { IsOptional, IsPositive, IsString, IsIn } from 'class-validator';

export class FindManyLessonsDto {
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
  order: 'asc' | 'desc' = 'asc';

  @IsOptional()
  @IsString()
  @IsIn(['id', 'title', 'order', 'createdAt'])
  sortBy: 'id' | 'title' | 'order' | 'createdAt' = 'order';
}

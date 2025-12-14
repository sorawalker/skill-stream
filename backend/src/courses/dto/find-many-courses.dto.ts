import { IsOptional, IsPositive, IsString, IsIn } from 'class-validator';

export class FindManyCoursesDto {
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
  @IsIn(['id', 'title', 'createdAt'])
  sortBy: 'id' | 'title' | 'createdAt' = 'id';
}

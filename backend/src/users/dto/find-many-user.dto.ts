import { IsOptional, IsPositive, IsString, IsIn } from 'class-validator';

export class FindManyUsersDto {
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
  @IsIn(['id', 'email', 'createdAt'])
  sortBy: 'id' | 'email' | 'createdAt' = 'id';
}

import { IsOptional, IsPositive, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class FindManyProgressDto {
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
  @IsIn(['id', 'updatedAt', 'progress', 'completed'])
  sortBy: 'id' | 'updatedAt' | 'progress' | 'completed' = 'updatedAt';
}


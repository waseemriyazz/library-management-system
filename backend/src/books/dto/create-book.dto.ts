import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean, MaxLength, Min, Matches } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{13}$/, { message: 'ISBN must be a 13-digit numeric string' })
  isbn!: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsString()
  @IsOptional()
  publishedDate?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  pageCount?: number;

  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @IsInt()
  @Min(1)
  authorId!: number;

  @IsInt()
  @Min(1)
  categoryId!: number;
}
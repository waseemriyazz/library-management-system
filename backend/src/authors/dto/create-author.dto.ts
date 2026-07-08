import { IsString, IsNotEmpty, IsOptional, IsEmail, MaxLength } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  bio?: string;
}
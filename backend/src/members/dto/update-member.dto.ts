import { IsString, IsOptional, IsEmail, MaxLength, IsDate } from 'class-validator';

export class UpdateMemberDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  address?: string;

  @IsDate()
  @IsOptional()
  membershipDate?: Date;
}
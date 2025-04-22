import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(5)
  title: string;

  @IsOptional()
  description: string;
}

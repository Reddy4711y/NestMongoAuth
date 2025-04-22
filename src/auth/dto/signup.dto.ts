import { IsEmail, IsString } from 'class-validator';
import { validatePassword } from './validation';

export class SignUpDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @validatePassword
  password: string;
}

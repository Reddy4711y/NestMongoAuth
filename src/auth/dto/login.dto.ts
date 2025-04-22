import { IsEmail } from 'class-validator';
import { validatePassword } from './validation';

export class LoginDto {
  @IsEmail()
  email: string;

  @validatePassword
  password: string;
}

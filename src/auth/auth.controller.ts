import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { CustomRequest } from 'src/types';
import { Authenticate } from './auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupData: SignUpDto) {
    return this.authService.signUp(signupData);
  }

  @Post('login')
  async login(@Body() loginData: LoginDto, @Res() res: Response) {
    const data = await this.authService.login(loginData, res);

    return res.json(data);
  }

  @Get('session')
  @Authenticate()
  session(@Req() { session }: CustomRequest) {
    return session;
  }
}

import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('users')
  getUsers() {
    return Array(100).fill({ name: 'arjun', email: 'arjun@gmail.com' });
  }
}

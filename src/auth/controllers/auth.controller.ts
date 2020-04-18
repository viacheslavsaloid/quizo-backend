import { Controller, Post, Body, ValidationPipe, Logger } from '@nestjs/common';
import { AuthService } from '../services';
import { AuthResponse } from 'src/shared';
import { UserDto, UserRole } from 'src/db';

@Controller()
export class AuthController {
  logger = new Logger('Auth Controller');
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUpAsCompany(@Body(ValidationPipe) dto: UserDto): Promise<AuthResponse> {
    return this.authService.signUp({ ...dto, role: UserRole.COMPANY });
  }

  @Post('/signin')
  signInAsCompany(@Body(ValidationPipe) dto: UserDto): Promise<AuthResponse> {
    return this.authService.signIn(dto);
  }

  @Post('/player/signup')
  signUpAsPlayer(@Body(ValidationPipe) dto: UserDto): Promise<AuthResponse> {
    return this.authService.signUp({ ...dto, role: UserRole.PLAYER });
  }

  @Post('/player/signin')
  signInAsPlayer(@Body(ValidationPipe) dto: UserDto): Promise<AuthResponse> {
    return this.authService.signIn(dto);
  }
}

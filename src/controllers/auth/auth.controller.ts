import { Controller, Post, Body, ValidationPipe, Logger, Get, UseGuards, Param } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';
import { AuthResponse } from 'src/models';
import { JwtAuthGuard } from 'src/guards';
import { GetUser } from 'src/utils/decorators';
import { UserDto } from 'src/db/dto';
import { User } from 'src/db/entities/user';

@Controller()
export class AuthController {
  logger = new Logger('Auth Controller');
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUpAsCompany(@Body(ValidationPipe) dto: UserDto): Promise<AuthResponse> {
    return this.authService.signUp(dto);
  }

  @Post('/signin')
  signInAsCompany(@Body(ValidationPipe) dto: UserDto): Promise<AuthResponse> {
    return this.authService.signIn(dto);
  }

  @Post('/:id/signup')
  signUpAsPlayer(@Body(ValidationPipe) user: UserDto, @Param('id') id): any /* Promise<AuthResponse> */ {
    return this.authService.signUpAsPlayer(user, id);
  }

  @Post('/:id/signin')
  signInAsPlayer(@Body(ValidationPipe) dto: UserDto): any /* Promise<AuthResponse> */ {
    // return this.authService.signIn(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/check')
  check(@GetUser() user: User): Partial<User> {
    return UserDto.fromDatabase(user);
  }
}

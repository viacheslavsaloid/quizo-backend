import { Controller, Post, Body, ValidationPipe, Logger, Get, UseGuards, Param } from '@nestjs/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthResponse } from 'src/app/shared/models';
import { JwtAuthGuard } from 'src/app/shared/guards';
import { GetUser, Swagger } from 'src/app/shared/decorators';
import { UserDto } from 'src/app/shared/dto';
import { User } from 'src/db/entities/user';

@Controller()
export class AuthController {
  logger = new Logger('Auth Controller');
  constructor(private authService: AuthService) {}

  @Swagger(UserDto)
  @Post('/signup')
  async signUpAsCompany(@Body(ValidationPipe) dto: UserDto): Promise<AuthResponse> {
    const { name, id, roles } = await this.authService.signUp(dto);
    return await this.authService.getToken({ name, id, roles });
  }

  @Swagger(UserDto)
  @Post('/signin')
  signInAsCompany(@Body(ValidationPipe) dto: UserDto): Promise<AuthResponse> {
    return this.authService.signIn(dto);
  }

  @Swagger(UserDto)
  @Post('/:id/signup')
  signUpAsPlayer(@Body(ValidationPipe) user: UserDto, @Param('id') id): any /* Promise<AuthResponse> */ {
    return this.authService.signUpAsPlayer(user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Swagger(UserDto)
  @Get('/me')
  me(@GetUser() user: User): Partial<User> {
    return UserDto.fromDatabase(user);
  }
}
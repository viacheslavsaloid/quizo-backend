import { Controller, Post, Body, ValidationPipe, Get, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthResponse } from 'src/app/models';
import { GetUser, Swagger } from 'src/app/utils/decorators';
import { User, UserRole } from 'src/db/entities/user';
import { JwtAuthGuard } from 'src/app/guards';
import { UserDto } from 'src/app/dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Swagger(UserDto)
  @Post('/company/signup')
  async signUpAsCompany(@Body(ValidationPipe) dto: UserDto): Promise<AuthResponse> {
    const payload = await this.authService.signUp({ dto, role: UserRole.COMPANY });
    const token = await this.authService.generateAuthToken({ payload, fields: ['id', 'roles', 'name'] });
    console.log(token);
    return token;
  }

  @Swagger(UserDto)
  @Post('/company/signin')
  async signInAsCompany(@Body(ValidationPipe) dto: UserDto): Promise<AuthResponse> {
    const payload = await this.authService.signIn({ dto });
    const token = await this.authService.generateAuthToken({ payload, fields: ['id', 'roles', 'name'] });
    return token;
  }

  @Swagger(UserDto)
  @Post('/signup')
  async signUpAsPlayer(@Body(ValidationPipe) dto: UserDto): Promise<AuthResponse> {
    const payload = await this.authService.signUp({ dto, role: UserRole.PLAYER });
    const token = await this.authService.generateAuthToken({ payload });
    return token;
  }

  @Swagger(UserDto)
  @Post('/signin')
  async signInAsPlayer(@Body(ValidationPipe) dto: UserDto): Promise<AuthResponse> {
    const payload = await this.authService.signIn({ dto });
    const token = await this.authService.generateAuthToken({ payload });
    return token;
  }

  @Swagger(UserDto)
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  me(@GetUser() user: User): Partial<User> {
    return user;
  }
}

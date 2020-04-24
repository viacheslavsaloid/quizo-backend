import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../settings/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWT_CONFIGS, PASSPORT_CONFIGS } from 'src/settings/configs';
import { AUTH_CONTROLLERS } from 'src/controllers/auth';
import { AUTH_SERVICES } from 'src/services/auth';
import { USER_REPOSITORIES } from 'src/db/repositories';
import { GameModule } from './game.module';

const AUTH_IMPORTS = [
  PassportModule.register(PASSPORT_CONFIGS),
  JwtModule.registerAsync(JWT_CONFIGS),
  TypeOrmModule.forFeature(USER_REPOSITORIES),
  forwardRef(() => GameModule)
];
const AUTH_PROVIDERS = [...AUTH_SERVICES, JwtStrategy];
const AUTH_EXPORTS = [PassportModule, JwtStrategy];

@Module({
  imports: AUTH_IMPORTS,
  providers: AUTH_PROVIDERS,
  exports: AUTH_EXPORTS,
  controllers: AUTH_CONTROLLERS
})
export class AuthModule {}

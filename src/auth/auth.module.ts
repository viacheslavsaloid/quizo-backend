import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONFIGS, PASSPORT_CONFIGS } from './configs';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AUTH_SERVICES } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AUTH_CONTROLLERS } from './controllers';
import { USER_REPOSITORIES } from 'src/db';

const AUTH_IMPORTS = [
  PassportModule.register(PASSPORT_CONFIGS),
  JwtModule.registerAsync(JWT_CONFIGS),
  TypeOrmModule.forFeature(USER_REPOSITORIES)
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

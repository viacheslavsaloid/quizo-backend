import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWT_CONFIGS, PASSPORT_CONFIGS } from 'src/app/shared/configs';
import { AUTH_CONTROLLERS } from 'src/app/controllers/auth';
import { GameModule } from './game.module';
import { AUTH_REPOSITORIES } from 'src/db/repositories';
import { AUTH_SERVICES } from 'src/app/services/auth';

const AUTH_IMPORTS = [
  PassportModule.register(PASSPORT_CONFIGS),
  JwtModule.registerAsync(JWT_CONFIGS),
  TypeOrmModule.forFeature(AUTH_REPOSITORIES),
  forwardRef(() => GameModule)
];
const AUTH_PROVIDERS = [...AUTH_SERVICES];
const AUTH_EXPORTS = [...AUTH_SERVICES, PassportModule, JwtModule];

@Module({
  imports: AUTH_IMPORTS,
  providers: AUTH_PROVIDERS,
  exports: AUTH_EXPORTS,
  controllers: AUTH_CONTROLLERS
})
export class AuthModule {}

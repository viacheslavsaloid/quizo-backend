import { AuthService } from './auth.service';
import { JwtStrategy } from 'src/app/utils/strategies';

export * from './auth.service';

export const AUTH_SERVICES = [AuthService, JwtStrategy];

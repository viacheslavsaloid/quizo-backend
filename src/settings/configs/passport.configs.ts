import { IAuthModuleOptions } from '@nestjs/passport';

export const PASSPORT_CONFIGS: IAuthModuleOptions = { defaultStrategy: 'jwt' };

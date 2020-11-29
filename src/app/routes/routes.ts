import { Routes } from 'nest-router';
import { GameModule } from 'src/app/modules/game.module';
import { AuthModule } from 'src/app/modules/auth.module';
import { ImagesModule } from 'src/app/modules/images.module';
import { TemplatesModule } from 'src/app/modules/templates.module';

export const ROOT_ROUTES: Routes = [
  {
    path: '/api',
    children: [
      {
        path: '/v1',
        children: [
          {
            path: '/auth',
            module: AuthModule
          },
          {
            path: '/images',
            module: ImagesModule
          },
          {
            path: '/templates',
            module: TemplatesModule,
          },
          {
            path: '/',
            module: GameModule
          }
        ]
      }
    ]
  }
];

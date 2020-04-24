import { Routes } from 'nest-router';
import { GameModule } from 'src/modules/game.module';
import { AuthModule } from 'src/modules/auth.module';
import { ImagesModule } from 'src/modules/images.module';

export const ROOT_ROUTES: Routes = [
  {
    path: '/auth',
    module: AuthModule
  },
  {
    path: '/api/v1',
    children: [
      {
        path: '/images',
        module: ImagesModule
      },
      {
        path: '/',
        module: GameModule
      }
    ]
  }
];

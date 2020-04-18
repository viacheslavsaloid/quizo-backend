import { Routes } from 'nest-router';
import { GameModule } from 'src/game/game.module';
import { AuthModule } from 'src/auth/auth.module';
import { ImagesModule } from 'src/images/images.module';

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
        path: '/games',
        module: GameModule
      }
    ]
  }
];

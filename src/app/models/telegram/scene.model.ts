import { AppContext } from './context.model';
import { Repository } from 'typeorm';
import { AuthService } from 'src/app/services/auth';
import { GamesService } from 'src/app/services/game';

export interface SceneProps {
  ctx: AppContext;
  repository?: Repository<any>;
  authService?: AuthService;
  gamesService?: GamesService;
}

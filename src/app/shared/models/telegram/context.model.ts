import { Context } from 'nestjs-telegraf';
import { User, Game } from 'src/db/entities';

export interface AppContext extends Context {
  user: User;
  game: Game;
}

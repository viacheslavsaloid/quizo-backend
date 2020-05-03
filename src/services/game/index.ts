import { GamesService } from './games/games.service';
import { RoundsService } from './rounds/rounds.service';
import { AnswersService } from './answers/answers.service';
import { QuestionsService } from './questions/questions.service';

export * from './games/games.service';
export * from './rounds/rounds.service';
export * from './answers/answers.service';
export * from './questions/questions.service';

export const GAME_SERVICES = [GamesService, RoundsService, AnswersService, QuestionsService];

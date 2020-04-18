import { GamesController } from './games/games.controller';
import { AnswersController } from './answers/answers.controller';
import { QuestionsController } from './questions/questions.controller';
import { RoundsController } from './rounds/rounds.controller';

export const GAME_CONTROLLERS = [GamesController, AnswersController, QuestionsController, RoundsController];

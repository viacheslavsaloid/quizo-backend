import { GamesService } from './games/games.service';
import { RoundsService } from './rounds/rounds.service';
import { AnswersService } from './answers/answers.service';
import { QuestionsService } from './questions/questions.service';
import { PlayersService } from './players/players.service';

export { GamesService } from './games/games.service';
export { RoundsService } from './rounds/rounds.service';
export { AnswersService } from './answers/answers.service';
export { QuestionsService } from './questions/questions.service';
export { PlayersService } from './players/players.service';

export const GAME_SERVICES = [GamesService, RoundsService, AnswersService, QuestionsService, PlayersService];

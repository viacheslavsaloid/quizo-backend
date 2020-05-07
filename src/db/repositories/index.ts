import { UserRepository } from './user';
import { GameRepository } from './game';
import { RoundRepository } from './round';
import { QuestionRepository } from './question';
import { AnswerRepository } from './answer';
import { PlayerRepository } from './player';
import { TelegramMediaRepository } from './telegram-media';

export * from './answer';
export * from './game';
export * from './player';
export * from './question';
export * from './answer';
export * from './round';
export * from './user';
export * from './telegram-media';

export const AUTH_REPOSITORIES = [UserRepository, PlayerRepository];
export const GAME_REPOSITORIES = [GameRepository, RoundRepository, QuestionRepository, AnswerRepository, PlayerRepository];

export const TELEGRAM_REPOSITORIES = [UserRepository, PlayerRepository, TelegramMediaRepository];

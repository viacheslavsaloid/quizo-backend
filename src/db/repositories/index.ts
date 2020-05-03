import { UserRepository } from './user';
import { GameRepository } from './game';
import { RoundRepository } from './round';
import { QuestionRepository } from './question';
import { AnswerRepository } from './answer';
import { PlayerRepository } from './player';
import { TelegramActionRepository } from './telegram-action';

export * from './answer';
export * from './game';
export * from './player';
export * from './question';
export * from './answer';
export * from './round';
export * from './user';
export * from './telegram-action';

export const AUTH_REPOSITORIES = [UserRepository];
export const GAME_REPOSITORIES = [
  GameRepository,
  RoundRepository,
  QuestionRepository,
  AnswerRepository,
  PlayerRepository
];

export const TELEGRAM_REPOSITORIES = [TelegramActionRepository];

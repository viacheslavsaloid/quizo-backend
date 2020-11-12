export interface GenerateGameTokenProps {
  gameId: string;
  userId?: string;
  role?: 'leader' | 'team';
}

export interface GenerateGameTokenResponse {
  token: string;
}


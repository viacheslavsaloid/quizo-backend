export interface RegisterToGameProps {
  gameId: string;
  userId: string;
  playerId?: string;
}

export interface RegisterToGameResponse {
  token: string;
}

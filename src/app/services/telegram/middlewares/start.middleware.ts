import { GameScene } from 'src/db/entities/player/game-scene';

export function startHandler(ctx) {
  ctx.session = { messages: ctx.session.messages };
  ctx.scene.enter(GameScene.START);
}

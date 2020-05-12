import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { DebugLogger } from 'src/app/utils/debug';

@WebSocketGateway()
export class SocketService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('msgToClient', payload);
  }

  emit(event: string, args) {
    this.server.emit(event, ...args);
  }

  afterInit(server: Server) {
    DebugLogger(this, 'Init');
  }

  handleDisconnect(client: Socket) {
    DebugLogger(this, `Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    DebugLogger(this, `Client connected: ${client.id}`);
  }
}

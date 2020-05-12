import { Module } from '@nestjs/common';
import { SocketService } from '../services/socket/socket.service';

@Module({
  imports: [],
  providers: [SocketService],
  exports: [SocketService]
})
export class SocketModule {}

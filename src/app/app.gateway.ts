import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { orchestrator } from 'src/orchestrator';

@WebSocketGateway(8080, { cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('msgToClient', payload, client.id);
  }

  async afterInit(server: any) {
    this.logger.log('Init');
    await orchestrator((value: string) =>
      this.server.emit('msgToClient', value),
    );
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any, ...args: any[]) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  getInstance() {
    return this.server;
  }
}

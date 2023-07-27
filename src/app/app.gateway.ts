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
import * as dotenv from 'dotenv';
import { auth } from 'google-auth-library';

dotenv.config();

const wsServer = Number(process.env.WS_SERVER ?? 8080);

@WebSocketGateway(wsServer, { cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, payload: string) {
    if (payload === 'restart') {
      await orchestrator((value: string) =>
        this.server.emit('msgToClient', value),
      );

      this.logger.log('Restart');
      this.server.emit('msgToClient', 'Restart bot');
    }
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

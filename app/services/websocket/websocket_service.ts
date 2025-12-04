import { OnConnect } from "@softmila/adonisjs-socketio";
import type { Socket } from 'socket.io';

export class WebsocketService
{

  socketList: Array<Socket> = [];

  /**
   * Connection d'un socket.
   * Data :
   * {
   *    "role": "host" / "participant"
   * }
   */
  @OnConnect()
  public async OnWebsocketConnect(socket: Socket, data: any)
  {
      if(data == null) socket.emit("on_response", {"response_type": "connection_fail"});

  }
}

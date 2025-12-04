import { OnConnect } from "@softmila/adonisjs-socketio";
import type { Socket } from 'socket.io';
import WebsocketMessageFactory from "./messageTypes/WebsocketMessageFactory.js";

export class WebsocketService
{

  socketList: Array<Socket> = [];

  /**
   * Connection d'un socket.
   * data:
   * {
   *    "role": "host" / "participant"
   * }
   */
  @OnConnect()
  public async OnWebsocketConnect(socket: Socket, data: any)
  {
      if(data == null || data.role == null)
      {
        socket.emit("on_response", WebsocketMessageFactory.getMessage("connection_failed", {}));
        socket.disconnect(true);
        return;
      }

      switch(data.role)
      {
        case "host":
          // Utilisateur veut host
      }

  }
}

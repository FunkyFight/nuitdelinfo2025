import { OnConnect, OnMessage } from "@softmila/adonisjs-socketio";
import type { Socket } from 'socket.io';
import WebsocketMessageFactory from "./messageTypes/WebsocketMessageFactory.js";
import { RoomService } from "#services/rooms/room_service";
import { inject } from "@adonisjs/core";
import Room from "#services/rooms/room";
import WebsocketMessage from "./messageTypes/WebsocketMessage.js";

@inject()
export class WebsocketService
{

  socketList: Array<Socket> = [];

  constructor(private room_service: RoomService){}

  /**
   * Connection d'un socket.
   * data:
   * {
   *    "role": "host" / "participant",
   *    "target_room_id": "ADQSD" // Si participant
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

      this.socketList.push(socket);

      switch(data.role)
      {
        case "host":
          // Utilisateur veut host
          let created_room: Room = this.room_service.createNewRoom(socket)
          socket.emit("on_message", WebsocketMessageFactory.getMessage("room_created", {"created_room_id": created_room.id}))
          break;
        case "participant":
          // Utilisateur veut participer dans une room
          if(data.target_room_id == null)
          {
            socket.emit("on_message", WebsocketMessageFactory.getMessage("connection_failed", {"reason": "Veuillez spécifier un id de room"}))
            socket.disconnect();
            return;
          }

          let target_room_id: string = data.target_room_id;
          let target_room: Room | null = this.room_service.getRoom(target_room_id)

          if(target_room == null)
          {
            socket.emit("on_message", WebsocketMessageFactory.getMessage("connection_failed", {"reason": "La room n'existe pas"}))
            socket.disconnect();
            return;
          }

          target_room.addParticipant(socket);

          let message: WebsocketMessage | null = WebsocketMessageFactory.getWebsocketMessage("room_joined");

          target_room.broadcast(message!, {who: socket, where: target_room.id})
          break;
      }
  }
}

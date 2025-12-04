import WebsocketMessage from '#services/websocket/messageTypes/WebsocketMessage';
import WebsocketMessageFactory from '#services/websocket/messageTypes/WebsocketMessageFactory';
import type { Socket } from 'socket.io'

export default class Room
{

  id: string;
  room_owner: Socket;
  participants: Array<Socket> = []
  variables: Map<string, any> = new Map()

  constructor(id: string, room_owner: Socket)
  {
    this.id = id;
    this.room_owner = room_owner;
  }

  addParticipant(user: Socket)
  {
    this.participants.push(user);
  }

  disconnectParticipant(user: Socket)
  {
    user.emit("on_message", WebsocketMessageFactory.getMessage("room_kick", {}))
    user.disconnect();
    let socketIndex = this.participants.findIndex(v => v == user)

    delete this.participants[socketIndex];
  }

  disconnectAll()
  {
    for(let user of this.participants)
    {
      user.emit("on_message", WebsocketMessageFactory.getMessage("room_kick", {}))
      user.disconnect();
    }

    this.room_owner.emit("on_message", WebsocketMessageFactory.getMessage("room_kick", {}))
    this.room_owner.disconnect();
  }

  emitTo(destination: RoomRole, message: WebsocketMessage, additionnal_data: {})
  {
    if(this.room_owner == null) return;

    switch(destination)
    {
      case RoomRole.OWNER:
        this.room_owner.emit("on_message", message.build(additionnal_data))
        break;

      case RoomRole.PARTICIPANTS:
        for(const participant of this.participants)
        {
          participant.emit("on_message", message.build(additionnal_data))
        }
        break;
    }
  }

  broadcast(message: WebsocketMessage, additionnal_data: {})
  {
    this.room_owner.emit("on_message", message.build(additionnal_data))
    for(const participant of this.participants)
    {
      participant.emit("on_message", message.build(additionnal_data))
    }
  }

}

enum RoomRole
{
  OWNER, PARTICIPANTS
}

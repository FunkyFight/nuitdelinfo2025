import WebsocketMessage from '#services/websocket/messageTypes/WebsocketMessage';
import type { Socket } from 'socket.io'

export default class Room
{

  room_owner: Socket;
  participants: Array<Socket> = []

  constructor(room_owner: Socket)
  {
    this.room_owner = room_owner;
  }

  addParticipant(user: Socket)
  {
    this.participants.push(user);
  }

  disconnectParticipant(user: Socket)
  {
    user.emit("on_message", )
    user.disconnect();
    let socketIndex = this.participants.findIndex(v => v == user)

    delete this.participants[socketIndex];
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

}

enum RoomRole
{
  OWNER, PARTICIPANTS
}

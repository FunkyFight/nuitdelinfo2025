import WebsocketMessage from '#services/websocket/messageTypes/WebsocketMessage';
import WebsocketMessageFactory from '#services/websocket/messageTypes/WebsocketMessageFactory';
import transmit from '@adonisjs/transmit/services/main'

export default class Room
{

  id: string;
  room_owner: string; // Changed from Socket to string (uid)
  participants: Array<string> = [] // Changed from Socket to string (uid)
  variables: Map<string, any> = new Map()

  constructor(id: string, room_owner: string)
  {
    this.id = id;
    this.room_owner = room_owner;
  }

  addParticipant(uid: string)
  {
    this.participants.push(uid);
  }

  removeParticipant(uid: string)
  {
    let idx = this.participants.findIndex(v => v == uid);
    if (idx > -1) {
      this.participants.splice(idx, 1);
    }
  }

  setVariable(name: string, value: any)
  {
    this.variables.set(name, value)
  }

  clearVariable(name: string)
  {
    this.variables.delete(name)
  }

  disconnectParticipant(uid: string)
  {
    transmit.broadcast(`client/${uid}`, {
      type: "on_message",
      data: WebsocketMessageFactory.getMessage("room_kick", {})
    })

    let socketIndex = this.participants.findIndex(v => v == uid)
    if (socketIndex > -1) {
      this.participants.splice(socketIndex, 1);
    }
  }

  disconnectAll()
  {
    for(let uid of this.participants)
    {
      transmit.broadcast(`client/${uid}`, {
        type: "on_message",
        data: WebsocketMessageFactory.getMessage("room_kick", {})
      })
    }

    transmit.broadcast(`client/${this.room_owner}`, {
      type: "on_message",
      data: WebsocketMessageFactory.getMessage("room_kick", {})
    })
  }

  emitTo(destination: RoomRole, message: WebsocketMessage, additionnal_data: {})
  {
    if(this.room_owner == null) return;

    switch(destination)
    {
      case RoomRole.OWNER:
        transmit.broadcast(`client/${this.room_owner}`, {
          type: "on_message",
          data: message.build(additionnal_data)
        })
        break;

      case RoomRole.PARTICIPANTS:
        for(const uid of this.participants)
        {
          transmit.broadcast(`client/${uid}`, {
            type: "on_message",
            data: message.build(additionnal_data)
          })
        }
        break;
    }
  }

  broadcast(message: WebsocketMessage, additionnal_data: {})
  {
    transmit.broadcast(`client/${this.room_owner}`, {
      type: "on_message",
      data: message.build(additionnal_data)
    })

    for(const uid of this.participants)
    {
      transmit.broadcast(`client/${uid}`, {
        type: "on_message",
        data: message.build(additionnal_data)
      })
    }
  }

}

export enum RoomRole
{
  NONE, OWNER, PARTICIPANTS
}

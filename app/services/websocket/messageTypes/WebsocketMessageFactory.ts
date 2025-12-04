import ConnectionFailedWebsocketMessage from "./types/ConnectionFailedWebsocketMessage.js";
import ConnectionSuccessWebsocketMessage from "./types/ConnectionSuccessWebsocketMessage.js";
import RoomCreatedWebsocketMessage from "./types/RoomCreatedWebsocketMessage.js";
import RoomDestroyedWebsocketMessage from "./types/RoomDestroyedWebsocketMessage.js";
import RoomJoinedWebsocketMessage from "./types/RoomJoinedWebsocketMessage.js";
import RoomKickWebsocketMessage from "./types/RoomKickWebsocketMessage.js";
import WebsocketMessage from "./WebsocketMessage.js"

type WebsocketMessageConstructor = new () => WebsocketMessage;

export default class WebsocketMessageFactory
{

  static messages: Map<string, WebsocketMessageConstructor> = new Map();

  static
  {
    // Server to client
    this.messages.set("connection_failed", ConnectionFailedWebsocketMessage)
    this.messages.set("connection_success", ConnectionSuccessWebsocketMessage)
    this.messages.set("room_kick", RoomKickWebsocketMessage)
    this.messages.set("room_created", RoomCreatedWebsocketMessage)
    this.messages.set("room_joined", RoomJoinedWebsocketMessage)
    this.messages.set("room_destroyed", RoomDestroyedWebsocketMessage)

    // Client to server
  }

  public static getMessage(message_type: string, additionnal_data: {}): {} | null
  {
    let message = this.messages.get(message_type);

    if(message == null) return null;

    return new message().build(additionnal_data);
  }

  public static getWebsocketMessage(message_type: string): WebsocketMessage | null
  {
    let message = this.messages.get(message_type);

    if(message == null) return null;

    return new message();
  }
}

import ConnectionFailedWebsocketMessage from "./types/ConnectionFailedWebsocketMessage.js";
import ConnectionSuccessWebsocketMessage from "./types/ConnectionSuccessWebsocketMessage.js";
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

    // Client to server
  }

  public static getMessage(message_type: string, additionnal_data: {}): {} | null
  {
    let message = this.messages.get(message_type);

    if(message == null) return null;

    return new message().build(additionnal_data);
  }
}

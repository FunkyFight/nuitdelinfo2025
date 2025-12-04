import ConnectionFailedWebsocketMessage from "./types/serverToClient/ConnectionFailedWebsocketMessage.js";
import ConnectionSuccessWebsocketMessage from "./types/serverToClient/ConnectionSuccessWebsocketMessage.js";
import RoomCreatedWebsocketMessage from "./types/serverToClient/RoomCreatedWebsocketMessage.js";
import RoomDestroyedWebsocketMessage from "./types/serverToClient/RoomDestroyedWebsocketMessage.js";
import RoomJoinedWebsocketMessage from "./types/serverToClient/RoomJoinedWebsocketMessage.js";
import RoomKickWebsocketMessage from "./types/clientToServer/RoomKickWebsocketMessage.js";
import WebsocketMessage from "./WebsocketMessage.js"
import RoomInfoRequestWebsocketMessage from "./types/clientToServer/RoomInfoRequestWebsocketMessage.js";
import RoomInfoResponseWebsocketMessage from "./types/serverToClient/RoomInfoResponseWebsocketMessage.js";
import ClientWebsocketMessage from "./ClientWebsocketMessage.js";
import IWebsocketMessage from "./IWebsocketMessage.js";
import IClientWebsocketMessage from "./IClientWebsocketMessage.js";
import InformViewChangeWebsocketMessage from "./types/serverToClient/InformViewChangeWebsocketMessage.js";
import InformViewChangeClientWebsocketMessage from "./types/clientToServer/InformViewChangeClientWebsocketMessage.js";

type WebsocketMessageConstructor = new () => IWebsocketMessage | IClientWebsocketMessage;

export default class WebsocketMessageFactory
{

  static messages: Map<string, WebsocketMessageConstructor> = new Map();

  static
  {
    // Server to client
    this.messages.set("connection_failed", ConnectionFailedWebsocketMessage)
    this.messages.set("connection_success", ConnectionSuccessWebsocketMessage)
    this.messages.set("room_created", RoomCreatedWebsocketMessage)
    this.messages.set("room_joined", RoomJoinedWebsocketMessage)
    this.messages.set("room_destroyed", RoomDestroyedWebsocketMessage)
    this.messages.set("room_info_response", RoomInfoResponseWebsocketMessage)
    this.messages.set("inform_view_change", InformViewChangeWebsocketMessage)

    // Client to server
    this.messages.set("room_kick", RoomKickWebsocketMessage)
    this.messages.set("room_info_request", RoomInfoRequestWebsocketMessage)
    this.messages.set("inform_view_change_client", InformViewChangeClientWebsocketMessage)
  }

  public static getMessage(message_type: string, additionnal_data: {}): {} | null
  {
    let message = this.messages.get(message_type);

    if(message == null) return null;

    return (new message() as IWebsocketMessage).build(additionnal_data);
  }

  public static getWebsocketMessage(message_type: string): WebsocketMessage | null
  {
    let message = this.messages.get(message_type);

    if(message == null) return null;

    return (new message() as IWebsocketMessage);
  }

  public static getClientWebsocketMessage(message_type: string): ClientWebsocketMessage | null
  {
    let message = this.messages.get(message_type);

    if(message == null) return null;

    return (new message() as IClientWebsocketMessage);
  }
}

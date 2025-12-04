import ConnectionFailedWebsocketMessage from "./types/ConnectionFailedWebsocketMessage.js";
import ConnectionSuccessWebsocketMessage from "./types/ConnectionSuccessWebsocketMessage.js";
import WebsocketMessage from "./WebsocketMessage.js"

type WebsocketMessageConstructor = new () => WebsocketMessage;

export default class WebsocketMessageFactory
{

  static messages: Map<String, WebsocketMessageConstructor> = new Map();

  static
  {
    // Server to client
    this.messages.set("connection_failed", ConnectionFailedWebsocketMessage)
    this.messages.set("connection_success", ConnectionSuccessWebsocketMessage)

    // Client to server
  }

  public static getMessage(message_type: String)
  {
    return this.messages.get(message_type);
  }
}

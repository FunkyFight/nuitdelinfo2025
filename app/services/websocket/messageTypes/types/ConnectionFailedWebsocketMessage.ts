import WebsocketMessage from "../WebsocketMessage.js";

export default class ConnectionFailedWebsocketMessage extends WebsocketMessage
{
  getMessageType(): String {
    return "connection_failed"
  }

}

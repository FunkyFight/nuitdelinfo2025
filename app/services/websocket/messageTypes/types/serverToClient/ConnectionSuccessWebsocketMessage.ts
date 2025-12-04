import WebsocketMessage from "../../WebsocketMessage.js";

export default class ConnectionSuccessWebsocketMessage extends WebsocketMessage
{
  getMessageType(): String {
    return "connection_success"
  }

}

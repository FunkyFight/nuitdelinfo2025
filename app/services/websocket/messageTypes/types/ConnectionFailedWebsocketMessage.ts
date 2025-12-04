import WebsocketMessage from "../WebsocketMessage.js";

/**
 * data: {
 *  "reason": "gneuh gneuh ça marche pas"
 * }
 */
export default class ConnectionFailedWebsocketMessage extends WebsocketMessage
{
  getMessageType(): String {
    return "connection_failed"
  }

}

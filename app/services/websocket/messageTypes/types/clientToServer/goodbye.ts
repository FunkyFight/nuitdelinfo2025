import ClientWebsocketMessage from "../../ClientWebsocketMessage.js";

/**
 * L'utilisateur informe de sa déconnection
 */
export default class goodbye extends ClientWebsocketMessage
{
  getMessageType(): String {
    return "goodbye"
  }

}

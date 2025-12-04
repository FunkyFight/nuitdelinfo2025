import ClientWebsocketMessage from "../../ClientWebsocketMessage.js";
import WebsocketMessage from "../../WebsocketMessage.js";

/**
 * Demander au serveur d'informer le changement de la vue
 *
 * data: {
 *  changeId: string
 * }
 */
export default class InformViewChangeClientWebsocketMessage extends ClientWebsocketMessage
{
  getMessageType(): String {
    return "inform_view_change_client"
  }

}

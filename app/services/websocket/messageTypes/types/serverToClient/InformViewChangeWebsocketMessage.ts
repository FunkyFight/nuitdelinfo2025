import ClientWebsocketMessage from "../../ClientWebsocketMessage.js";
import WebsocketMessage from "../../WebsocketMessage.js";

/**
 * Ordonner au client de changer de vue
 *
 * data: {
 *  changeId: string,
 *  showAnswer: boolean
 * }
 */
export default class InformViewChangeWebsocketMessage extends ClientWebsocketMessage
{
  getMessageType(): String {
    return "inform_view_change"
  }

}

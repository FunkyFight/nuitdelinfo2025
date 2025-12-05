import ClientWebsocketMessage from "../../ClientWebsocketMessage.js";
import WebsocketMessage from "../../WebsocketMessage.js";

/**
 * Demander les infos de la room
 *
 * data: {
 *  from: userid,
 *  whichRoom: roodid
 * }
 */
export default class RoomInfoRequestWebsocketMessage extends ClientWebsocketMessage
{
  getMessageType(): String {
    return "room_info_request"
  }

}

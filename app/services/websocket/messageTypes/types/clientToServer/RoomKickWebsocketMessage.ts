import WebsocketMessage from "../../WebsocketMessage.js";

/**
 * Éjecte l'utilisateur
 *
 * data: {
 *  from: userid,
 *  room: roodid
 *  target: targetid
 * }
 */
export default class RoomKickWebsocketMessage extends WebsocketMessage
{
  getMessageType(): String {
    return "room_kick"
  }

}

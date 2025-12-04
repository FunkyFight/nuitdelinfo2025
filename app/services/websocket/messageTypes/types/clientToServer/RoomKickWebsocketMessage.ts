import ClientWebsocketMessage from "../../ClientWebsocketMessage.js";

/**
 * Éjecte l'utilisateur
 *
 * data: {
 *  from: userid,
 *  room: roodid
 *  target: targetid
 * }
 */
export default class RoomKickWebsocketMessage extends ClientWebsocketMessage
{
  getMessageType(): String {
    return "room_kick"
  }

}

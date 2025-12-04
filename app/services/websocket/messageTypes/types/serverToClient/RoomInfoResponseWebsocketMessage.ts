import WebsocketMessage from "../../WebsocketMessage.js";

/**
 * Envoie les infos de la room
 *
 * data: {
 *  towards: userid,
 *  room: {
 *    id: roomid,
 *    owner: userid,
 *    users: [userid, userid, userid]
 *  }
 * }
 */
export default class RoomInfoResponseWebsocketMessage extends WebsocketMessage
{
  getMessageType(): String {
    return "room_info_response"
  }

}

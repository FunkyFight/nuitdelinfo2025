import WebsocketMessage from "../WebsocketMessage.js";

/**
 * data: {
 *  "created_room_id": room.id
 * }
 */
export default class RoomCreatedWebsocketMessage extends WebsocketMessage
{
  getMessageType(): String {
    return "room_created"
  }

}

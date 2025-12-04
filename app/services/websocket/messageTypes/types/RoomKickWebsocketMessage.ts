import WebsocketMessage from "../WebsocketMessage.js";

export default class RoomKickWebsocketMessage extends WebsocketMessage
{
  getMessageType(): String {
    return "room_kick"
  }

}

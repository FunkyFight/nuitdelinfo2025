import WebsocketMessage from "../../WebsocketMessage.js";

export default class RoomJoinedWebsocketMessage extends WebsocketMessage
{
  getMessageType(): String {
    return "room_joined"
  }

}

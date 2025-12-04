import WebsocketMessage from "../../WebsocketMessage.js";

export default class RoomDestroyedWebsocketMessage extends WebsocketMessage
{
  getMessageType(): String {
    return "room_destroyed"
  }

}

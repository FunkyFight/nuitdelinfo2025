import IClientWebsocketMessage from "./IClientWebsocketMessage.js";
import IWebsocketMessage from "./IWebsocketMessage.js";
import WebsocketMessage from "./WebsocketMessage.js";

export default abstract class ClientWebsocketMessage implements IClientWebsocketMessage
{
  abstract getMessageType(): String;



  build(sender: string, room: string, additionnalData: {}): {}
  {
    return {
      "message_type": this.getMessageType(),
      "user": sender,
      "room": room,
      "data": additionnalData
    }
  }

}

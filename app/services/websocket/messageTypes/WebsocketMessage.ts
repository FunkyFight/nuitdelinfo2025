import IWebsocketMessage from "./IWebsocketMessage.js";

export default abstract class WebsocketMessage implements IWebsocketMessage
{
  abstract getMessageType(): String;

  build(additionnalData: {}): {}
  {
    return {
      "message_type": this.getMessageType(),
      "data": additionnalData
    }
  }

}

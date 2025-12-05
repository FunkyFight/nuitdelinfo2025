import ClientWebsocketMessage from "./messageTypes/ClientWebsocketMessage.js";
import WebsocketMessage from "./messageTypes/WebsocketMessage.js";

export default class ClientWebsocketMessageSender
{
  public static sendMessageToServer(client: string, room: string, message: ClientWebsocketMessage, additionnal_data: {})
  {
    fetch("/transmit/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message.build(client, room, additionnal_data)),
    });
  }
}



import ClientWebsocketMessage from "#services/websocket/messageTypes/ClientWebsocketMessage"

export default class ClientWebsocketMessageSender {
  public static sendMessageToServer(
    client: string,
    room: string,
    wbsmessage: ClientWebsocketMessage,
    additionalData: Record<string, any> = {}
  ) {



    fetch('/transmit/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wbsmessage.build(client, room, additionalData)),
    })
  }
}

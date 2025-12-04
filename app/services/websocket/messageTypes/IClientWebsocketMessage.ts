export default interface IClientWebsocketMessage
{
  getMessageType(): String;

  build(sender: string, room: string, additionnalData: {}): {};
}

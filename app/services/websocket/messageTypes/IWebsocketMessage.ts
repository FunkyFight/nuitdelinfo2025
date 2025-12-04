export default interface IWebsocketMessage
{
  getMessageType(): String;

  build(additionnalData: {}): {};
}

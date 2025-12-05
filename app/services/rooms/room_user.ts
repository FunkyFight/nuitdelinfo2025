import Room, { RoomRole } from "./room.js";
import { Subscription, Transmit } from '@adonisjs/transmit-client'

export default class RoomUser
{

  public uid: string
  public room_id: string = ""
  public transmitSubscriptions: Map<string, Subscription> = new Map();
  private transmitClient: Transmit

  constructor(
    public role: RoomRole,
    private window: any
  ) {

    this.uid = `client_${Math.random().toString(36).substring(2, 15)}`

    this.transmitClient = new Transmit({
      baseUrl: window.location.origin,
    })

  }

  transmitSubscribe(name: string, path: string): Subscription
  {
    const subscription = this.transmitClient.subscription(`client/${this.uid}`)
    subscription.create()
    this.transmitSubscriptions.set(name, subscription)
    return subscription
  }

  getSubscription(name: string): any
  {
    return this.transmitSubscriptions.get(name)
  }

}

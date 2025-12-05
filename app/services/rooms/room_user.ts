import { Subscription, Transmit } from '@adonisjs/transmit-client'
import { RoomRole } from './room_user_type.js';

export default class RoomUser
{

  public uid: string
  public room_id: string = ""
  public transmitSubscriptions: Map<string, Subscription> = new Map();
  private transmitClient: Transmit

  constructor(
    public role: RoomRole,
    public origin: string
  ) {

    this.uid = `client_${Math.random().toString(36).substring(2, 15)}`

    this.transmitClient = new Transmit({
      baseUrl: origin,
    })

  }

  transmitSubscribe(name: string, path: string): Subscription
  {
    const subscription = this.transmitClient.subscription(path)
    subscription.create()
    this.transmitSubscriptions.set(name, subscription)
    return subscription
  }

  getSubscription(name: string): any
  {
    return this.transmitSubscriptions.get(name)
  }

}

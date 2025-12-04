import Room from "./room.js";

export class RoomService
{

  rooms: Map<string, Room> = new Map();

  createNewRoom(owner: string): Room
  {
    let id: string = this.makeid(8);

    while(this.rooms.has(id))
    {
      id = this.makeid(8);
    }

    let new_room: Room = new Room(id, owner);


    this.rooms.set(id, new_room);
    return new_room;
  }

  destroyRoom(id: string)
  {
    let room: Room | undefined = this.rooms.get(id);

    if(room == undefined) return;

    room.disconnectAll();
    this.rooms.delete(id)
  }

  getRoom(id: string): Room | null
  {
    let room: Room | undefined = this.rooms.get(id);

    if(room == undefined) return null;
    return room;
  }


  private makeid(length: number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

}

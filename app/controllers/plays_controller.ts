import { RoomRole } from '#services/rooms/room';
import { RoomService } from '#services/rooms/room_service';
import RoomUser from '#services/rooms/room_user';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class PlaysController
{

  constructor(private room_service: RoomService){}

  play({request, inertia, response}: HttpContext)
  {
    const room_id = request.qs().room_id;

    if(this.room_service.getRoom(room_id) == null) return response.redirect("/");
    return inertia.render('play', {room_id: room_id})
  }

}

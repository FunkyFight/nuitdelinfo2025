import { RoomService } from '#services/rooms/room_service';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app';

@inject()
export default class PlaysController
{


  async play({ request, inertia, response }: HttpContext) {
    const roomService = await app.container.make(RoomService)
    const room_id = request.qs().room_id


    const room = roomService.getRoom(room_id)

    if (!room) {
      return response.redirect("/")
    }

    return inertia.render('play', { room_id })
  }

}

/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'
import { handleConnection } from '#start/socket'
import PlaysController from '#controllers/plays_controller'

router.on('/').renderInertia('home')
router.on('/join').renderInertia('join')

router.on('/debug').renderInertia('debug')
router.get('/play', [PlaysController, 'play']) // Côté client

// Transmit connection endpoint
router.post('/connect', async ({ request, response }) => {
  const { uid, role, target_room_id } = request.body()

  if (!uid || !role) {
    return response.badRequest({ error: 'Missing uid or role' })
  }

  const result = handleConnection(uid, { role, target_room_id })

  if (!result.success) {
    return response.badRequest(result)
  }

  return response.ok(result)
})

router.post("/transmit/message", async ({ request, response }) => {
  transmit.broadcast("server", request.body())
})

transmit.registerRoutes();

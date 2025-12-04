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

router.on('/').renderInertia('home')
router.on('/join').renderInertia('join')
router.on('/room').renderInertia('room')

router.on('/debug').renderInertia('debug')

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

transmit.registerRoutes();

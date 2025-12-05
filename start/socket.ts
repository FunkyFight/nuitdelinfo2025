import transmit from '@adonisjs/transmit/services/main'
import { RoomService } from "#services/rooms/room_service"
import WebsocketMessageFactory from '#services/websocket/messageTypes/WebsocketMessageFactory'
import { RoomRole } from '#services/rooms/room'

// Initialize room service
const roomService = new RoomService()

// Store client connections with their metadata
const clientConnections = new Map<string, {
  uid: string
  role: 'host' | 'participant'
  roomId?: string
}>()

// Handle subscription events
transmit.on('subscribe', ({ uid, channel }) => {
  console.log(`Client ${uid} subscribed to channel: ${channel}`)
})

transmit.on('unsubscribe', ({ uid, channel }) => {
  console.log(`Client ${uid} unsubscribed from channel: ${channel}`)

  // Handle disconnection
  const clientData = clientConnections.get(uid)
  if (clientData) {
    handleDisconnection(uid, clientData)
  }
})




transmit.on('broadcast', ({ channel, payload }) => {
  if(payload == null) return;

  console.log("broadcast", channel);
  const data = payload as Record<string, any>;

  switch(data.message_type)
  {
    case "inform_view_change_client":
      let room = roomService.getRoom(data.room);
      if(room == null) return;

      room.emitTo(RoomRole.PARTICIPANTS, WebsocketMessageFactory.getWebsocketMessage("inform_view_change")!, {
        changeId: data.changeId
      })
      break;
  }
})




// Handle client connection (called from HTTP route)
export function handleConnection(uid: string, data: { role: 'host' | 'participant', target_room_id?: string }) {
  console.log('Connection détectée', uid, data)

  if (data == null || data.role == null) {
    transmit.broadcast(`client/${uid}`, {
      type: 'on_response',
      data: WebsocketMessageFactory.getMessage('connection_failed', {})
    })
    return { success: false, error: 'Invalid connection data' }
  }

  switch (data.role) {
    case 'host': {
      // Utilisateur veut host
      const created_room = roomService.createNewRoom(uid)

      // Store client connection info
      clientConnections.set(uid, {
        uid,
        role: 'host',
        roomId: created_room.id
      })

      // Send room created message
      transmit.broadcast(`client/${uid}`, {
        type: 'on_message',
        data: WebsocketMessageFactory.getMessage('room_created', {
          created_room_id: created_room.id
        })
      })

      return { success: true, roomId: created_room.id }
    }

    case 'participant': {
      // Utilisateur veut participer dans une room
      if (data.target_room_id == null) {
        transmit.broadcast(`client/${uid}`, {
          type: 'on_message',
          data: WebsocketMessageFactory.getMessage('connection_failed', {
            reason: 'Veuillez spécifier un id de room'
          })
        })
        return { success: false, error: 'Missing room ID' }
      }

      const target_room_id: string = data.target_room_id
      const target_room = roomService.getRoom(target_room_id)

      if (target_room == null) {
        transmit.broadcast(`client/${uid}`, {
          type: 'on_message',
          data: WebsocketMessageFactory.getMessage('connection_failed', {
            reason: "La room n'existe pas"
          })
        })
        return { success: false, error: 'Room not found' }
      }

      target_room.addParticipant(uid)

      // Store client connection info
      clientConnections.set(uid, {
        uid,
        role: 'participant',
        roomId: target_room.id
      })

      const message = WebsocketMessageFactory.getWebsocketMessage('room_joined')
      target_room.broadcast(message!, { who: uid, where: target_room.id })

      transmit.broadcast(`client/${uid}`, {
        type: "debug",
        data: {}
      })

      return { success: true, roomId: target_room.id }
    }

    default:
      return { success: false, error: 'Invalid role' }
  }
}

// Handle client disconnection
function handleDisconnection(uid: string, clientData: { uid: string, role: 'host' | 'participant', roomId?: string }) {
  console.log('Déconnexion détectée', uid)

  switch (clientData.role) {
    case 'host':
      if (clientData.roomId) {
        roomService.destroyRoom(clientData.roomId)
      }
      break

    case 'participant':
      if (clientData.roomId) {
        roomService.getRoom(clientData.roomId)?.removeParticipant(uid)
      }
      break
  }

  // Remove client from connections map
  clientConnections.delete(uid)
}

// Export for use in routes
export { roomService, clientConnections }

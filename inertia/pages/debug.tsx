import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import ClientWebsocketMessageSender from '~/services/ClientWebsocketMessageSender'
import WebsocketMessageFactory from '#services/websocket/messageTypes/WebsocketMessageFactory'
import RoomUser from '../../app/services/rooms/room_user'
import { RoomRole } from '#services/rooms/room_user_type'

export default function Home() {
  const [socketState, setSocketState] = useState("disconnected")
  const [roomUser, setRoomUser] = useState<RoomUser>()


  useEffect(() => {
    setRoomUser(new RoomUser(RoomRole.NONE, window))

    roomUser?.transmitSubscribe("client", `client/${roomUser.uid}`)
    .onMessage((message: any) => {
      if (message.type === 'on_message') {
      }
    })

    return () => {
      roomUser?.getSubscription("client").delete()
    }
  }, [])

  async function hostRoom() {
    console.log("Lancement host room")
    setSocketState('connecting...')

    try {
      const response = await fetch('/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: roomUser!.uid,
          role: 'host'
        })
      })

      const result = await response.json()
      console.log('Connection result:', result)

      roomUser!.role = RoomRole.OWNER

      if (result.success) {
        roomUser!.room_id = result.roomId
        setSocketState('host_connected')
      } else {
        setSocketState('connection_failed')
        console.error('Failed to host room:', result.error)
      }
    } catch (error) {
      console.error('Error hosting room:', error)
      setSocketState('error')
    }
  }

  async function joinRoom(targetRoomId: string) {
    console.log("Joining room:", targetRoomId)
    setSocketState('connecting...')

    try {
      const response = await fetch('/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: roomUser!.uid,
          role: 'participant',
          target_room_id: targetRoomId
        })
      })

      const result = await response.json()
      console.log('Connection result:', result)

      if (result.success) {
        roomUser!.room_id = result.roomId
        setSocketState('participant_connected')
      } else {
        setSocketState('connection_failed')
        console.error('Failed to join room:', result.error)
      }
    } catch (error) {
      console.error('Error joining room:', error)
      setSocketState('error')
    }
  }

  function testMessage() {
    console.log("Sending test message")
    // Send message to server using the client message sender
    ClientWebsocketMessageSender.sendMessageToServer(
      roomUser!.uid,
      roomUser!.room_id,
      WebsocketMessageFactory.getClientWebsocketMessage("room_info_request")!, {}
    )
  }

  return (
    <>
      <Head title="Debug - Transmit" />

      <div style={{ padding: '20px' }}>
        <h1>Transmit Debug Page</h1>

        <div style={{ marginBottom: '20px' }}>
          <p><strong>Client UID:</strong> {roomUser?.uid}</p>
          <p><strong>Status:</strong> {socketState}</p>
          {roomUser?.room_id && <p><strong>Room ID:</strong> {roomUser?.room_id}</p>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button onClick={hostRoom} style={{ marginRight: '10px' }}>
            Host Room
          </button>

          <button onClick={() => {
            const roomIdInput = prompt('Enter room ID to join:')
            if (roomIdInput) {
              joinRoom(roomIdInput)
            }
          }}>
            Join Room
          </button>

          <button onClick={testMessage}>
            Test message to server
          </button>
        </div>
      </div>
    </>
  )
}

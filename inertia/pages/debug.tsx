import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { Transmit } from '@adonisjs/transmit-client'

export default function Home() {
  const [socketState, setSocketState] = useState("disconnected")
  const [transmit, setTransmit] = useState<Transmit | null>(null)
  const [uid, setUid] = useState<string>('')
  const [roomId, setRoomId] = useState<string>('')

  useEffect(() => {
    // Generate a unique ID for this client
    const clientUid = `client_${Math.random().toString(36).substring(2, 15)}`
    setUid(clientUid)

    // Initialize Transmit client
    const transmitClient = new Transmit({
      baseUrl: window.location.origin,
    })

    setTransmit(transmitClient)

    // Subscribe to personal channel
    const subscription = transmitClient.subscription(`client/${clientUid}`)

    subscription.create()

    subscription.onMessage((message: any) => {
      console.log('Received message:', message)

      if (message.type === 'on_message') {
        const data = message.data
        console.log('Message data:', data)

        if (data.message_type === 'room_created') {
          setRoomId(data.created_room_id)
          setSocketState('room_created')
        } else if (data.message_type === 'room_joined') {
          setSocketState('room_joined')
        } else if (data.message_type === 'connection_failed') {
          setSocketState('connection_failed')
          console.error('Connection failed:', data.reason)
        }
      }
    })

    return () => {
      subscription.delete()
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
          uid: uid,
          role: 'host'
        })
      })

      const result = await response.json()
      console.log('Connection result:', result)

      if (result.success) {
        setRoomId(result.roomId)
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
          uid: uid,
          role: 'participant',
          target_room_id: targetRoomId
        })
      })

      const result = await response.json()
      console.log('Connection result:', result)

      if (result.success) {
        setRoomId(result.roomId)
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

  return (
    <>
      <Head title="Debug - Transmit" />

      <div style={{ padding: '20px' }}>
        <h1>Transmit Debug Page</h1>

        <div style={{ marginBottom: '20px' }}>
          <p><strong>Client UID:</strong> {uid}</p>
          <p><strong>Status:</strong> {socketState}</p>
          {roomId && <p><strong>Room ID:</strong> {roomId}</p>}
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
        </div>
      </div>
    </>
  )
}

import RoomUser from "#services/rooms/room_user";
import { RoomRole } from "#services/rooms/room_user_type";
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react"

interface PageProps {
  room_id: string | number,
  [key: string]: any
}

export default function Home() {
  let [debug, setDebug] = useState<string>("Hi!");
  const { room_id } = usePage<PageProps>().props
  let [roomuser, setRoomUser] = useState<RoomUser>();

  useEffect(() => {
    const newRoomUser = initRoomUser(room_id as string);
    setRoomUser(newRoomUser);

    tryToJoinRoom(newRoomUser, room_id as string)  // ← Utilise newRoomUser
      .then((b) => {
        console.log("room joined")
        newRoomUser.getSubscription("client")  // ← Ici aussi
          .onMessage((message: any) => {
            console.log("Message received")
            let message_type = message.message_type;

            switch(message_type) {
              case "inform_view_change":
                setDebug("VIEW CHANGE !!!")
                break;
            }
          })
      })
  }, [])

  return (
    <>
      <p>{room_id} & {debug}</p>
    </>
  )
}


function initRoomUser(room_id: string): RoomUser
{
  let roomuser = new RoomUser(RoomRole.PARTICIPANTS, window.location.origin)
  roomuser.room_id = room_id;
  console.log("room créé  " + roomuser.uid)
  roomuser.transmitSubscribe("client", `client/${roomuser.uid}`)

  return roomuser
}

async function tryToJoinRoom(roomUser: RoomUser, targetRoom: string): Promise<boolean>
{
  try {
      const response = await fetch('/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: roomUser!.uid,
          role: 'participant',
          target_room_id: targetRoom
        })
      })

      const result = await response.json()
      console.log('Connection result:', result)

      if (result.success) {
        roomUser!.room_id = result.roomId
        return true;
      } else {
        console.error('Failed to join room:', result.error)
        return false;
      }
    } catch (error) {
      console.error('Error joining room:', error)
      return false;
    }
}

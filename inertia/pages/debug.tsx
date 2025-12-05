import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import ClientWebsocketMessageSender from '~/services/ClientWebsocketMessageSender'
import WebsocketMessageFactory from '#services/websocket/messageTypes/WebsocketMessageFactory'
import RoomUser from '../../app/services/rooms/room_user'
import { RoomRole } from '#services/rooms/room_user_type'
import QuestionBasePresentationParticipant from '~/components/QuestionBasePresentationParticipant'

export default function Home() {
  let [selection, setSelection] = useState<number>();

  return (
    <>
     <QuestionBasePresentationParticipant question={'Lorem ipsum lorem ipsum'} answers={["lorem", "ipsum", "dolor", "amet"]} answer={2} showAnswer={true} selectedAnswer={2} onSelectAnswer={(i) => setSelection(i)}></QuestionBasePresentationParticipant>
    </>
  )
}

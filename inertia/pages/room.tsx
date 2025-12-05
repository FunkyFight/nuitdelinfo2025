import RoomUser from "#services/rooms/room_user";
import { RoomRole } from "#services/rooms/room_user_type";
import InformViewChangeClientWebsocketMessage from "#services/websocket/messageTypes/types/clientToServer/InformViewChangeClientWebsocketMessage";
import WebsocketMessageFactory from "#services/websocket/messageTypes/WebsocketMessageFactory";
import { Transmit } from "@adonisjs/transmit-client";
import { Head } from "@inertiajs/react"
import { useEffect, useState } from "react";
import QuestionBasePresentation from "~/components/QuestionBasePresentation";
import RoomFooter from "~/components/roomfooter"
import RoomLanding from "~/components/roomlanding"
import STLPresentation from "~/components/STLPresentation";
import ClientWebsocketMessageSender from "~/services/ClientWebsocketMessageSender";

const input_styles: React.CSSProperties = {
  borderWidth: 2,
  borderRadius: "25px",
  margin: "5px",
  padding: "10px 25px",
  width: "100%",
  maxWidth: "350px",
}

const questions = [
    { id: "base", showAnswer: false },
    { id: "question1", showAnswer: false },
    { id: "question1", showAnswer: true },
    { id: "stl1", showAnswer: false },
]

interface Question {
    id: string;
    showAnswer: boolean;
}

export default function Room() {

    const [roomUser, setRoomUser] = useState<RoomUser | null>(null)
    const [roomId, setRoomId] = useState<string|null>(null)
    const [question, setQuestion] = useState<Question>(questions[0])
    const [questionIndex, setQuestionIndex] = useState<number>(0)

    

    useEffect(() => {
        


    // Subscribe to personal channel
        const roomUser = new RoomUser(RoomRole.OWNER, window.location.origin)
        setRoomUser(roomUser)

        const clientUid = roomUser.uid
        const subscription = roomUser.transmitSubscribe("client", `client/${clientUid}`)
        subscription.onMessage((message: any) => {
            console.log('Received message:', message)

            if (message.type === 'on_message') {
                const data = message.data
                switch (data.message_type) {
                    case 'room_created':
                        setRoomId(data.created_room_id)
                        break
                    case 'room_joined':
                        break
                    case 'connection_failed':
                        console.error('Connection failed:', data.reason)
                        break
                }
            }
        })
        hostRoom(clientUid);

    return () => {
        subscription.delete()
    }}, [])

    async function hostRoom(uid: string) {

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
        } else {
            console.error('Failed to host room:', result.error)
        }
        } catch (error) {
        console.error('Error hosting room:', error)
        }
    }

    async function nextQuestion() {
        const nextIndex = questionIndex + 1
        if (nextIndex < questions.length) {
            setQuestionIndex(nextIndex)
            setQuestion(questions[nextIndex])
        }
    }
    async function previousQuestion() {
        const prevIndex = questionIndex - 1
        if (prevIndex >= 0) {
            setQuestionIndex(prevIndex)
            setQuestion(questions[prevIndex])
        }
    }

    return <>
        <Head title="Room" />
        {
            question.id == "base" && (<RoomLanding roomId={roomId} />)
        }
        {
            question.id == "question1" && (<QuestionBasePresentation question="Sample question?" image="https://upload.wikimedia.org/wikipedia/commons/2/2a/Croissant-Petr_Kratochvil.jpg" answers={["Answer 1", "Answer 2", "Answer 3", "Answer 4"]} answer={0} showAnswer={question.showAnswer}></QuestionBasePresentation>)
        }
        {
            question.id == "stl1" && (<STLPresentation title="3D Model Example" stlFile="https://litter.catbox.moe/folv114g6x2wzpwo.stl" ></STLPresentation>)
        }
        { roomId && (
        <RoomFooter onNext={nextQuestion} onBack={previousQuestion} showNext={questionIndex < questions.length - 1} showBack={questionIndex > 0} />
    )
        }
    
    
    
    
    
    
    </>
    
}


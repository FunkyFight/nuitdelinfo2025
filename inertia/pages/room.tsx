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
import { titleQuestions, possibleAnswers, goodAnswers, questionsFile } from '#services/questions'

const input_styles: React.CSSProperties = {
  borderWidth: 2,
  borderRadius: "25px",
  margin: "5px",
  padding: "10px 25px",
  width: "100%",
  maxWidth: "350px",
}

interface Question {
    id: string;
    showAnswer: boolean;
}

export default function Room() {

    const [roomUser, setRoomUser] = useState<RoomUser | null>(null)
    const [roomId, setRoomId] = useState<string|null>(null)
    const [question, setQuestion] = useState<Question>(questionsFile[0])
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
        if (nextIndex < questionsFile.length) {
            setQuestionIndex(nextIndex)
            setQuestion(questionsFile[nextIndex])

            ClientWebsocketMessageSender.sendMessageToServer(roomUser!.uid, roomUser!.room_id, WebsocketMessageFactory.getClientWebsocketMessage("inform_view_change_client")!, {changeId: question.id, showAnswer: question.showAnswer})
            
        }
    }
    async function previousQuestion() {
        const prevIndex = questionIndex - 1
        if (prevIndex >= 0) {
            setQuestionIndex(prevIndex)
            setQuestion(questionsFile[prevIndex])

            ClientWebsocketMessageSender.sendMessageToServer(roomUser!.uid, roomUser!.room_id, WebsocketMessageFactory.getClientWebsocketMessage("inform_view_change_client")!, {changeId: question.id, showAnswer: question.showAnswer})
            
        }
    }

    return <>
        <Head title="Room" />
        {
            question.id == "base" && (<RoomLanding roomId={roomId} />)
        }
        {
            question.id == "question1" && (<QuestionBasePresentation question={titleQuestions[0]} answers={possibleAnswers[0] as [string, string, string, string]} answer={goodAnswers[0] as 0 | 1 | 2 | 3} showAnswer={question.showAnswer}></QuestionBasePresentation>)
        }
        {
            question.id == "question2" && (<QuestionBasePresentation question={titleQuestions[1]} answers={possibleAnswers[1] as [string, string, string, string]} answer={goodAnswers[1] as 0 | 1 | 2 | 3} showAnswer={question.showAnswer}></QuestionBasePresentation>)
        }
        {
            question.id == "question3" && (<QuestionBasePresentation question={titleQuestions[2]} answers={possibleAnswers[2] as [string, string, string, string]} answer={goodAnswers[2] as 0 | 1 | 2 | 3} showAnswer={question.showAnswer}></QuestionBasePresentation>)
        }
        {
            question.id == "question4" && (<QuestionBasePresentation question={titleQuestions[3]} answers={possibleAnswers[3] as [string, string, string, string]} answer={goodAnswers[3] as 0 | 1 | 2 | 3} showAnswer={question.showAnswer}></QuestionBasePresentation>)
        }
        {
            question.id == "question5" && (<QuestionBasePresentation question={titleQuestions[4]} answers={possibleAnswers[4] as [string, string, string, string]} answer={goodAnswers[4] as 0 | 1 | 2 | 3} showAnswer={question.showAnswer}></QuestionBasePresentation>)
        }
        {
            question.id == "question6" && (<QuestionBasePresentation question={titleQuestions[5]} answers={possibleAnswers[5] as [string, string, string, string]} answer={goodAnswers[5] as 0 | 1 | 2 | 3} showAnswer={question.showAnswer}></QuestionBasePresentation>)
        }
        {
            question.id == "question7" && (<QuestionBasePresentation question={titleQuestions[6]} answers={possibleAnswers[6] as [string, string, string, string]} answer={goodAnswers[6] as 0 | 1 | 2 | 3} showAnswer={question.showAnswer}></QuestionBasePresentation>)
        }
        {
            question.id == "question8" && (<QuestionBasePresentation question={titleQuestions[7]} answers={possibleAnswers[7] as [string, string, string, string]} answer={goodAnswers[7] as 0 | 1 | 2 | 3} showAnswer={question.showAnswer}></QuestionBasePresentation>)
        }
        {
            question.id == "question9" && (<QuestionBasePresentation question={titleQuestions[8]} answers={possibleAnswers[8] as [string, string, string, string]} answer={goodAnswers[8] as 0 | 1 | 2 | 3} showAnswer={question.showAnswer}></QuestionBasePresentation>)
        }
        {
            question.id == "question10" && (<QuestionBasePresentation question={titleQuestions[9]} answers={possibleAnswers[9] as [string, string, string, string]} answer={goodAnswers[9] as 0 | 1 | 2 | 3} showAnswer={question.showAnswer}></QuestionBasePresentation>)
        }
        {
            question.id == "stl1" && (<STLPresentation title="Vous avez atteint la fin du quiz ! Voici un ordinateur portable miniature en 3D ! Vous pouvez glisser-déposer d'autres fichiers STL si vous le souhaitez." stlFile="https://files.catbox.moe/95zkyh.stl" ></STLPresentation>)
        }
        { roomId && (
        <RoomFooter onNext={nextQuestion} onBack={previousQuestion} showNext={questionIndex < questionsFile.length - 1} showBack={questionIndex > 0} />
    )
        }
    
    
    
    
    
    
    </>

}


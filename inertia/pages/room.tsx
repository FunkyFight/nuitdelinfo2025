import { Transmit } from "@adonisjs/transmit-client";
import { Head } from "@inertiajs/react"
import { useEffect, useState } from "react";
import QuestionBasePresentation from "~/components/QuestionBasePresentation";
import RoomFooter from "~/components/roomfooter"
import RoomLanding from "~/components/roomlanding"

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
]

interface Question {
    id: string;
    showAnswer: boolean;
}

export default function Room() {

    const [socketState, setSocketState] = useState("disconnected")
    const [transmit, setTransmit] = useState<Transmit | null>(null)
    const [uid, setUid] = useState<string>('')
    const [roomId, setRoomId] = useState<string|null>(null)
    const [question, setQuestion] = useState<Question>(questions[0])
    const [questionIndex, setQuestionIndex] = useState<number>(0)
    const [showAnswer, setShowAnswer] = useState<boolean>(false)

    

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
                switch (data.message_type) {
                    case 'room_created':
                        setRoomId(data.created_room_id)
                        setSocketState('room_created')
                        break
                    case 'room_joined':
                        setSocketState('room_joined')
                        break
                    case 'connection_failed':
                        setSocketState('connection_failed')
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
        { roomId && (
        <RoomFooter onNext={nextQuestion} onBack={previousQuestion} showNext={questionIndex < questions.length - 1} showBack={questionIndex > 0} />
    )
        }
    
    
    
    
    
    
    </>
}


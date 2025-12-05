import RoomUser from "#services/rooms/room_user";
import { RoomRole } from "#services/rooms/room_user_type";
import { Head, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react"
import QuestionBasePresentationParticipant from "~/components/QuestionBasePresentationParticipant";
import PlayLanding from "~/components/playlanding";
import STLPresentation from "~/components/STLPresentation";
import { titleQuestions, possibleAnswers, goodAnswers, questionsFile } from '#services/questions';

interface PageProps {
  room_id: string | number,
  [key: string]: any
}

interface Question {
  id: string;
  showAnswer: boolean;
}

export default function Home() {
  let [debug, setDebug] = useState<string>("Hi!");
  const { room_id } = usePage<PageProps>().props
  let [roomuser, setRoomUser] = useState<RoomUser>();

  let [selection, setSelection] = useState<number | null>();
  let [lastChangeId, setLastChangeId] = useState<string>();
  let [question, setQuestion] = useState<Question>(questionsFile[0]);

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
                let changeId = message.changeId
                setQuestion({id: changeId, showAnswer: message.showAnswer})
                if(lastChangeId != changeId)
                {
                  setSelection(null)
                }
                break;
            }
          })
      })
  }, [])

  return (
    <>
      <Head title="Play" />
        {
            question.id == "base" && (<PlayLanding />)
        }
        {
            question.id == "question1" && (<QuestionBasePresentationParticipant question={titleQuestions[0]} answers={possibleAnswers[0] as [string, string, string, string]} selectedAnswer={selection ?? null} onSelectAnswer={setSelection} showAnswer={question.showAnswer} answer={goodAnswers[0] as 0 | 1 | 2 | 3}></QuestionBasePresentationParticipant>)
        }
        {
            question.id == "question2" && (<QuestionBasePresentationParticipant question={titleQuestions[1]} answers={possibleAnswers[1] as [string, string, string, string]} selectedAnswer={selection ?? null} onSelectAnswer={setSelection} showAnswer={question.showAnswer} answer={goodAnswers[1] as 0 | 1 | 2 | 3}></QuestionBasePresentationParticipant>)
        }
        {
            question.id == "question3" && (<QuestionBasePresentationParticipant question={titleQuestions[2]} answers={possibleAnswers[2] as [string, string, string, string]} selectedAnswer={selection ?? null} onSelectAnswer={setSelection} showAnswer={question.showAnswer} answer={goodAnswers[2] as 0 | 1 | 2 | 3}></QuestionBasePresentationParticipant>)
        }
        {
            question.id == "question4" && (<QuestionBasePresentationParticipant question={titleQuestions[3]} answers={possibleAnswers[3] as [string, string, string, string]} selectedAnswer={selection ?? null} onSelectAnswer={setSelection} showAnswer={question.showAnswer} answer={goodAnswers[3] as 0 | 1 | 2 | 3}></QuestionBasePresentationParticipant>)
        }
        {
            question.id == "question5" && (<QuestionBasePresentationParticipant question={titleQuestions[4]} answers={possibleAnswers[4] as [string, string, string, string]} selectedAnswer={selection ?? null} onSelectAnswer={setSelection} showAnswer={question.showAnswer} answer={goodAnswers[4] as 0 | 1 | 2 | 3}></QuestionBasePresentationParticipant>)
        }
        {
            question.id == "question6" && (<QuestionBasePresentationParticipant question={titleQuestions[5]} answers={possibleAnswers[5] as [string, string, string, string]} selectedAnswer={selection ?? null} onSelectAnswer={setSelection} showAnswer={question.showAnswer} answer={goodAnswers[5] as 0 | 1 | 2 | 3}></QuestionBasePresentationParticipant>)
        }
        {
            question.id == "question7" && (<QuestionBasePresentationParticipant question={titleQuestions[6]} answers={possibleAnswers[6] as [string, string, string, string]} selectedAnswer={selection ?? null} onSelectAnswer={setSelection} showAnswer={question.showAnswer} answer={goodAnswers[6] as 0 | 1 | 2 | 3}></QuestionBasePresentationParticipant>)
        }
        {
            question.id == "question8" && (<QuestionBasePresentationParticipant question={titleQuestions[7]} answers={possibleAnswers[7] as [string, string, string, string]} selectedAnswer={selection ?? null} onSelectAnswer={setSelection} showAnswer={question.showAnswer} answer={goodAnswers[7] as 0 | 1 | 2 | 3}></QuestionBasePresentationParticipant>)
        }
        {
            question.id == "question9" && (<QuestionBasePresentationParticipant question={titleQuestions[8]} answers={possibleAnswers[8] as [string, string, string, string]} selectedAnswer={selection ?? null} onSelectAnswer={setSelection} showAnswer={question.showAnswer} answer={goodAnswers[8] as 0 | 1 | 2 | 3}></QuestionBasePresentationParticipant>)
        }
        {
            question.id == "question10" && (<QuestionBasePresentationParticipant question={titleQuestions[9]} answers={possibleAnswers[9] as [string, string, string, string]} selectedAnswer={selection ?? null} onSelectAnswer={setSelection} showAnswer={question.showAnswer} answer={goodAnswers[9] as 0 | 1 | 2 | 3}></QuestionBasePresentationParticipant>)
        }
        {
            question.id == "stl1" && (<STLPresentation title="Vous avez atteint la fin du quiz ! Voici un ordinateur portable miniature en 3D ! Vous pouvez glisser-déposer d'autres fichiers STL si vous le souhaitez." stlFile="https://files.catbox.moe/95zkyh.stl" ></STLPresentation>)
        }
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

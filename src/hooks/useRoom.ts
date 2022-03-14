import { addDoc, collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { useAuth } from "./useAuth";

export type QuestionData = {
  id?: string,
  content: string,
  author: {
    name: string,
    avatar: string,
  },
  isHighlighted: boolean,
  isAnswered: boolean,
  asktime?: Date
}

export function useRoom(roomId: string | undefined) {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [title, setTitle] = useState('');
  const {user} = useAuth();

  async function sendQuestion(newQuestion: string) {

    if (newQuestion.trim().length < 5) {
      return undefined;
    }

    if(!user) {
      throw new Error('You must be logged in');
    }

    const question : QuestionData = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
      asktime: new Date(Date.now()),
    };
    const doc = await addDoc(collection(db, `rooms/${roomId}/questions`), question);
    return doc;
  }

  useEffect(()=> {
    async function fetchRoom() {
      const roomSnapPromise = getDoc(doc(db, `rooms/${roomId}`));
      const room = (await roomSnapPromise).data();
      setTitle(room?.name); //TODO define type
    }
    fetchRoom();

    const unsub = onSnapshot(
      query(collection(db, `rooms/${roomId}/questions`)), 
      querySnapshot => {
        const questionsArray : QuestionData[] = [];
        querySnapshot.forEach(docSnap=>{
          const question = {...docSnap.data(), id: docSnap.id};
          questionsArray.push(question as QuestionData);
        })
        questionsArray.sort((a, b) => {
          return (a.asktime! > b.asktime!) ? -1 : 0
        });
        setQuestions(questionsArray);
      }
    )
    return unsub;
  },
  [roomId]
  );

  return { questions, title, sendQuestion };
}
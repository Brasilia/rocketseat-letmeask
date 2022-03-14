import { addDoc, collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';

import '../styles/room.scss'

type RoomParams = {
  id: string;
}

type QuestionData = {
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

export function Room() {
  const navigate = useNavigate();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [title, setTitle] = useState('');

  const { user } = useAuth();
  const roomId = params.id;

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

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim().length < 5) {
      return;
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

    await addDoc(collection(db, `rooms/${roomId}/questions`), question);
    setNewQuestion('');
  }

  function askForLogin () {
    return ( 
      user ? 
      <div className='user-info'>
        <img src={user.avatar} alt={user.name} />
        <span>{user.name}</span>
      </div>
      :
      <span>Para enviar uma pergunta, <button>faça seu login</button></span>
    );
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" onClick={()=>navigate('/')}/>
          <RoomCode code={params.id!} />
        </div>
      </header>

      <main>
        <div className='room-title'>
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta{questions.length !== 1 && 's'}</span> }
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea 
            placeholder='O que você quer perguntar?' 
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className='form-footer'>
            {askForLogin()}
            <Button type='submit' disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>

        <div className='question-list'>
          {questions.map(question => {
            return (
              <Question
                key={question.id} // each element in a list should have a unique key (see "algoritmo de reconciliação")
                content={question.content}
                author={question.author}
              />
            );
          })}
        </div>
        
      </main>
    </div>
  );
}
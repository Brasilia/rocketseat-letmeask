import { FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss'

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  
  const roomId = params.id;
  const {questions, title, sendQuestion} = useRoom(roomId);
  
  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();
    if(!sendQuestion(newQuestion)){
      return;
    }
    setNewQuestion('');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" onClick={()=>navigate('/')}/>
          <div>
            <RoomCode code={params.id!} />
            <Button isOutlined>Encerrar sala</Button> 
          </div>
        </div>
      </header>

      <main>
        <div className='room-title'>
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta{questions.length !== 1 && 's'}</span> }
        </div>

        <div className='question-list'>
          {questions.map(question => {
            return (
              <Question
                key={question.id} // each element in a list should have a unique key (see "algoritmo de reconciliação").
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
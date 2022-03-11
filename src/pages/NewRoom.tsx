import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'

import { addDoc, collection } from "firebase/firestore";

import '../styles/auth.scss'
import { db } from '../services/firebase'

export function NewRoom(){
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newRoom, setNewRoom] = useState('');

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();
    if (newRoom.trim() === '') {
      return;
    }
    const roomsRef = collection(db ,'rooms');
    const roomData = {
      name: newRoom,
      authorId: user?.id,
      authorName: user?.name
    }
    const roomRef = await addDoc( roomsRef, roomData);
    navigate(`/rooms/${roomRef.id}`);
  }

  const form =
    <form onSubmit={handleCreateRoom}>
      <input 
        type="text" 
        placeholder='Nome da sala'
        onChange={event => setNewRoom(event.target.value)}
        value={newRoom}
      />
      <Button type="submit">
        Criar sala
      </Button>
    </form>
  ;
  
  const main =
    <main>
      <div className='main-content'>
        <img src={logoImg} alt="Letmeask" />
        <h1>{user?.name}</h1>
        <h2>Criar uma nova sala </h2>
        {form}
        <p>
          Quer entrarem uma sala existente? <Link to="/">clique aqui</Link>
        </p>
      </div>
    </main>
  ;

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      {main}
    </div>
  )
}
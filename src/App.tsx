import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { createContext, useState, useEffect } from 'react'

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { auth, GoogleAuthProvider, signInWithPopup } from './services/firebase';
import { UserInfo } from 'firebase/auth';


type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContext = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}


export const authContext = createContext({} as AuthContext); // maybe contexts should be in their own folder/file?


function App() {
  const [user, setUser] = useState<User>();

  function setUserProfile(user: UserInfo) {
    const { displayName, photoURL, uid} = user;

    if (!displayName || !photoURL) {
      throw new Error('Missing information from Google Account');
    }

    setUser({
      id: uid,
      name: displayName,
      avatar: photoURL
    })
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    setUserProfile(user);
  }

  useEffect(
    () => {
      auth.onAuthStateChanged(user => {
        if (user) {
          setUserProfile(user);
        }
      })
    },
    []
  )

  return (
    <BrowserRouter>
      <authContext.Provider value={{ user, signInWithGoogle }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="rooms/new" element={<NewRoom />} />
        </Routes>
      </authContext.Provider>
    </BrowserRouter>
  );
}

export default App;

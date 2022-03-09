import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { createContext, useState } from 'react'

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { auth, GoogleAuthProvider, signInWithPopup } from './services/firebase';


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

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const { displayName, photoURL, uid} = userCredential.user;

    if (!displayName || !photoURL) {
      throw new Error('Missing information from Google Account');
    }

    setUser({
      id: uid,
      name: displayName,
      avatar: photoURL
    })
  }

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

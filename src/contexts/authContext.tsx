import { UserInfo, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../services/firebase";


type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContext = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const authContext = createContext({} as AuthContext);

export function AuthContextProvider(props: AuthContextProviderProps) {
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
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          setUserProfile(user);
        }
      })
      return unsubscribe; // Entendi que aqui se retorna a função para que o observer possa ser liberado ao sair do escopo, mas o Diego retornou o retorno da função, "()"
    },
    []
  )
  
  return (
    <authContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </authContext.Provider>
  ); 
}
import { createContext, useContext, useState, } from 'react';
import type { ReactNode } from 'react';

interface User {
  nombre_usuario: string;
  nombre_rol: 'Medico' | 'Enfermero' | 'Admin' | string;
  correo: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const setUserPersintence = (user: User | null) => {
    if(user){
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    setUser(user);
  }

  return (
    <UserContext.Provider value={{ user, setUser: setUserPersintence }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
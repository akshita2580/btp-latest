import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from "../config/firebase"
type User = {
  fullName: string;
  email: string;
  password:string;
  confirmPassword:string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); // Initially, no user is set

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}



// export const AuthContext = createContext();

// export const AuthContextProvider = ({children}) => {
//     const [user, setUser] = useState(null);
//     const [isAuthenticated, setisAuthenticated] = useState(undefined);
    
//     useEffect(()=> {
//         const unsub = onAuthStateChanged(auth, (user) => {
//             if(user){
//                 setisAuthenticated(true);
//                 setUser(user);
//             }
//             else{
//                 setisAuthenticated(false);
//                 setUser(null);
//             }
//         });
//         return unsub;
//     }, [])

//     const login = async(email, password) => {
//         try{

//         }
//         catch(e){

//         }
//     }
//     const logout = async() => {
//         try{

//         }
//         catch(e){

//         }
//     }
//     return (
//         <AuthContextProvider value = {{user, isAuthenticated, login, logout}}>
//             {children}
//         </AuthContextProvider>
//     )

// }
// export const useAuth = () =>{
//     const value = useContext(AuthContext);
//     if(!value){

//     }
// }

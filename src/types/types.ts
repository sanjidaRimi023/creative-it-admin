import type { User, UserCredential } from "firebase/auth";
import type { ReactNode } from "react";

export interface IAuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}
export interface IAuthProviderProps {
    children : ReactNode
}
export interface IProtectedRouteProps {
    children: ReactNode;
}
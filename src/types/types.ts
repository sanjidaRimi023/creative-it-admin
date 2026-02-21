import type { User, UserCredential } from "firebase/auth";
import type { ReactNode } from "react";

export interface IAuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}
export interface IAuthProviderProps {
  children: ReactNode;
}
export interface IProtectedRouteProps {
  children: ReactNode;
}
export type LoginInputs = {
  email: string;
  password: string;
};

//---- project ----
export interface Project {
  _id: string;
  title: string;
  description: string;
  location: string;
  liveLink: string;
  image: string; // Changed from imageUrl to image
  bgColor: string;
}

export interface ProjectFormInputs {
  title: string;
  description: string;
  location: string;
  liveLink: string;
  image: FileList;
  bgColor: string;
}

// -----Testimonial----
export interface Testimonial {
  _id: string;
  clientName: string;
  review: string;
  image: string;
  location: string;
  role: string;
  country: string;
}

export interface TestimonialFormInputs {
  clientName: string;
  review: string;
  image: FileList;
  location: string;
  role: string;
  country: string;
}

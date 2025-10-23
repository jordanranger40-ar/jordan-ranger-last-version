import  { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "./lib/services/users";


 interface User {
    id: string;
    firstName: string;
    lastName?: string | null;
    email: string;
    password?: string;
    role: string;
    token:string
  }

declare module "next-auth" {

  interface User {
    id: string;
    firstName: string;
    lastName?: string | null;
    email: string;
    password?: string;
    role: string;
    token:string
  }

  interface Session {
    user: User;
  }

  
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName: string;
    role: string;
    email: string;
    token:string
  }
}

export const authOptions: NextAuthOptions = {
  
  debug:true,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        console.log("user55");
        const { email, password } = credentials!;
        if (!email || !password) return null;
        const result = await login({ email, password });
     if (!result) return null

          return {
          id: result.id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          role: result.role,
          token:result.token
        } as User;
        
      },
      
    }),
    
  ],

  callbacks: {
    
    async jwt({token,user}){
      
      
        if(user){
            token.id=user.id
            token.firstName=user.firstName
            token.role=user.role
            token.token=user.token
           
        }
        console.log("token: ",token);
        return token
    },

    async session({session,token}){
   if (session.user){
    session.user.id=token.id
    session.user.firstName=token.firstName
    session.user.role=token.role
    session.user.token=token.token
   }
   console.log("session: ",session);
   return session
    },
    
  },
};

import NextAuth from "next-auth"
import {authOptions} from "@/app/models/db/authOptions"
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
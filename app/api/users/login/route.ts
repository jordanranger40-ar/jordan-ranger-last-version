import { login } from "@/app/models/db/lib/services/users"
import { NextResponse } from "next/server"


export const POST= async (request:Request)=>{
    try {
        const body= await request.json()
        const result= await login(body)
        if (result===null){
return NextResponse.json({data:null, message:"Please check the email and the password"},{status:409})
        }else {
return NextResponse.json({data:result, message:"Logged in successfully"},{status:200})

        }
    } catch (error) {
        console.log("error: ",error);
        
        return NextResponse.json({data:error, message:"Error in login"},{status:500})

    }
}
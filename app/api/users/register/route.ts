import { register } from "@/app/models/db/lib/services/users"
import { NextResponse } from "next/server"


export const POST= async (request:Request)=>{

    try {
        const body= await request.json()
        const result= await register(body)
        if(result.data=== null){
return NextResponse.json({data:result.data,message:result.message},{status:409})

        }else {
return NextResponse.json({data:result.data,message:result.message},{status:201})
        }
        
    } catch (error) {
        return NextResponse.json({data:error,message:"Error in creating the user"},{status:500})

    }
}
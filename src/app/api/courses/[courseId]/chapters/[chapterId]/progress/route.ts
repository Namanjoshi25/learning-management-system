import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
    req :Request,
    {params} : {params : {courseId :string , chapterId:string}}
){
    try {
        const {userId} = await auth()
        const {isCompleted} = await req.json()
        console.log(isCompleted ,"the request json value");

        if(!userId) return new NextResponse("Unauthorized request" ,{status:401})

            const userProgress = await db.userProgress.upsert({
                where:{
                    chapterId_userId :{
                        chapterId: params.chapterId,
                        userId 
                        
                    }
                },
                update:{
                    isCompleted
                },create:{
                    userId,
                    chapterId:params.chapterId,
                    isCompleted
                }
            })

            return NextResponse.json(userProgress)

        
    } catch (error) {
        console.log("Error updating the chapter progress" , error);
        return new NextResponse("Internal Error" , {status:500})
    }
}
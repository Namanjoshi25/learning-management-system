import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function DELETE

(
    req : Request,
    {params} : {params : {attachmentId :string,courseId:string}}
){
    try {
        const {userId} = await auth();
        const {courseId,attachmentId} = params;
        if(!userId) return new NextResponse("Unauthorized" ,{status:401})

            const courseOwner = await db.course.findUnique({
                where:{
                    id:courseId,
                  userId:userId
                }
            })
            if(!courseOwner) return new NextResponse("Unauthorized" , {status:400})
           const attachment =  await db.attachment.delete({
                where:{
                    id: attachmentId,
                    courseId:courseId
                }
            })

            return NextResponse.json(attachment)
            
        
    } catch (error) {
        console.log("Error deleteing attachment" , error);
        return new NextResponse("Internal error",{status:500})
    }

}
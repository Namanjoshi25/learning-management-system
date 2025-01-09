import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request ,{params} : {params : {courseId :string}}
){
    try {
        const {userId} = await auth();
        const {courseId} = params;

        if(!userId) return new NextResponse("Unauthorized request",{status:401})

            const course = await db.course.findUnique({
                where:{
                    id:courseId,
                    userId:userId
                },
               
            })
            if(!course) return new NextResponse("Unauthorized request" , {status:401})

    
                    const publishedCourse = await db.course.update({
                        where:{
                            id:courseId,
                            userId:userId
                        },
                        data:{
                            isPublished:false
                        }
                    })

                return NextResponse.json(publishedCourse)


        
    } catch (error) {
        console.log("Error unPublishing the course" ,error);
        return new NextResponse("Internal error" , {status: 500})
    }

}
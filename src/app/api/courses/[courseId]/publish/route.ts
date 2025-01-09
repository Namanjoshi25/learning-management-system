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
                include:{
                    chapters:{
                        include:{
                            muxData:true
                        }
                    }
                }
            })
            if(!course) return new NextResponse("Unauthorized request" , {status:401})

      const hasPublishedChapters = course.chapters.some(chapter => chapter.isPublished)
      if(!course.title || !course.description || !course.imageUrl || !course.categoryId ||!hasPublishedChapters) return new NextResponse("Missing required Fields")
                    const publishedCourse = await db.course.update({
                        where:{
                            id:courseId,
                            userId:userId
                        },
                        data:{
                            isPublished:true
                        }
                    })

                return NextResponse.json(publishedCourse)


        
    } catch (error) {
        console.log("Error Publishing the course" ,error);
        return new NextResponse("Internal error" , {status: 500})
    }

}
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req :Request ,
    {params } : {params : {courseId : string,chapterId :string}}) {
        try {
            const {userId} = await auth();
            const {courseId, chapterId} = params;

            if(!userId) return new NextResponse("Unauthorized Request",{status:401})

                const ownCourse = await db.course.findUnique({
                    where:{
                        id :courseId,
                        userId: userId
                    }
                })
                if(!ownCourse)return new NextResponse("Unauthorized Request",{status:401})

                    const chapter = await db.chapter.findUnique({
                        where :{
                            id:chapterId,
                            courseId: courseId
                        }
                    })

                    const muxData = await db.muxData.findUnique({
                        where : {
                            chapterId : chapterId
                        }
                    })
                    if(!chapter || !muxData || !chapter?.title || !chapter.description ||!chapter.videoUrl){
                        return new NextResponse("Missing required fields" , {status:400})

                    }
                        const publishedChapter = await db.chapter.update({
                            where :{
                                id : chapterId,
                                courseId : courseId
                            },
                            data:{
                                isPublished:true
                            }
                        })

                        return NextResponse.json(publishedChapter)
                   


            
        } catch (error) {
            console.log("Error while publishing the chapter");
            return new NextResponse("Internal Error",{status: 500})
        }

}
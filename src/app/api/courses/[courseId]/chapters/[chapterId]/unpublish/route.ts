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

                  

                   
                        const unPublishedChapter = await db.chapter.update({
                            where :{
                                id : chapterId,
                                courseId : courseId
                            },
                            data:{
                                isPublished:false
                            }
                        })
                        const publishedChapterInCourse = await db.chapter.findMany({
                            where:{
                                courseId :courseId,
                                isPublished:true
                            }
                        })
                        if(!publishedChapterInCourse.length){
                            await db.course.update({
                                where:{
                                    id: courseId,
                          
                                },data:{
                                    isPublished:false
                                }
                            })
                        }

                        return NextResponse.json(unPublishedChapter)
                   


            
        } catch (error) {
            console.log("Error while publishing the chapter",error);
            return new NextResponse("Internal Error",{status: 500})
        }

}
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT
(req:Request , 
    {params} :{params :{courseId :string}
}){
    try {
        const {userId} = await auth();
        const {courseId} = params;
        const list = await req.json()
        console.log(list);

        if(!userId) return new NextResponse("Unauthorized",{status:401})
            
            const CourseOwner  = await db.course.findUnique(
             {   where:{
                    id :courseId,
                    userId: userId
                }}
            )
        
            if(!CourseOwner) return new NextResponse("Unauthorized",{status:401})

               for(let item of list.list){
                await db.chapter.update({
                    where :{
                        id : item.id
                    },
                    data:{position : item.position}
                })
               }
               return new NextResponse("Success" , {status:200})
    } catch (error) {
        console.log("Error while reordering the chapters" , error);
        return new NextResponse("Internal Error" , {status: 500})
    }

}
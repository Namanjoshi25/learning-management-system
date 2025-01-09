import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req :Request,
    {params} : {params:{courseId:string}}
){
    try {
        const user = await currentUser();
        if(!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) return new NextResponse("Unauthorized request" , {status :401})

            const course = await db.course.findUnique({
                where:{
                    id:params.courseId,
                    isPublished:true
                }
            })

            const purchase = await db.purchase.findUnique({
                where:{
                    courseId_userId :{
                        userId:user.id,
                        courseId:params.courseId
                    }
                }
            })
            if(purchase) return new NextResponse("Aleardy purchased" , {status:400})
                if(!course) return new NextResponse("Coures not found" , {status:404})

                  const purchased=  await db.purchase.create({
                        data:{
                            courseId:params.courseId,
                            userId:user.id
                        }
                    })
        return NextResponse.json(purchased)
    } catch (error) {
        console.log("Error in checkout" , error);
        return new NextResponse('Internal error' , {status:500})
    }
}
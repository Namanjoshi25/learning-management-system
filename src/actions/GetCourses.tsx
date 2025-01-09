import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";
import GetProgress from "./GetProgress";


type CourseWithProgressWithCategory =Course & {
    category : Category | null
    chapters: {id :string}[]
    progress : number | null
}
type GetCourses ={
    userId : string 
    title? :string
    categoryId? :string
}
export const GetCourse =async({userId , title , categoryId} : GetCourses) :Promise<CourseWithProgressWithCategory[]>=>{
    try {
        const courses = await db.course.findMany({
            where:{
                isPublished:true,
                title:{
                    contains: title,
                    mode:'insensitive'
                },
                categoryId
            },
            include:{
                category:true,
                chapters:{
                    where:{
                        isPublished:true
                    },
                    select: {
                        id:true
                    }
                    
                },
                purchases :{
                    where:{
                        userId
                    }
                }
            },
            orderBy:{
                createdAt:"desc"
            }
        })

        const coursesWithProgress :CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async(course)=>{
                if(course.purchases.length ===0){
                    return {
                        ...course,
                        progress : null
                    }
                }
                const progressPercentage = await GetProgress(userId , course.id)
                return {
                    ...course,
                    progress : progressPercentage
                }
            })
            
        )
        return coursesWithProgress
       
        
    } catch (error) {
        console.log("Error in getting courses" , error);
        return [];
    }
}
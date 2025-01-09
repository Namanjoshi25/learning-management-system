import { db } from "@/lib/db"
import { Category, Chapter, Course } from "@prisma/client"
import GetProgress from "./GetProgress"

type CourseWithProgressWithCategory =Course & {
    category :Category,
    chapters : Chapter[],
    progress : null |number
}
type DashboardCourses  ={
    completedCourses: CourseWithProgressWithCategory[],
    coursesInProgress : CourseWithProgressWithCategory[]
}

export const GetDashboardCourses =async(userId :string):Promise<DashboardCourses>=>{
try {

    const purchaseCourses = await db.purchase.findMany({
        where:{
            userId:userId
        },
        select:{
            course:{
                include:{
                    category:true,
                    chapters :{
                        where:{
                            isPublished:true
                        }
                    }
                }
            }
        }
    })

    const courses =purchaseCourses.map(purchase => purchase.course) as CourseWithProgressWithCategory[]


    for(let course of courses){
        const progress = await GetProgress(userId, course.id)
        course["progress"]=progress
    }

    const completedCourses = courses.filter(course => course.progress === 100)
    const coursesInProgress = courses.filter(course => (course.progress ?? 0) < 100)

    return { completedCourses ,
         coursesInProgress}
    
} catch (error) {
    console.log("Error getting dashboard courses" ,error);
    return {
        completedCourses: [],
        coursesInProgress : []
    }
}
 
}
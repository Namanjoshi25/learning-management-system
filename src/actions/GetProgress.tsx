import { db } from "@/lib/db";


const GetProgress = async(
    userId : string,
    courseId :string
) : Promise<number> => {
 try {
    const publishedChapterIds = await db.chapter.findMany({
        where:{
            isPublished :true,
            courseId:courseId
        },
        select:{
            id:true
        }
    }).then(chapters => chapters.map(chapter => chapter.id))


    const validCompletedChapter = await db.userProgress.count({
        where:{
            userId:userId,
            chapterId:{
                in :publishedChapterIds
            },
            isCompleted:true
        }
    })
    const progressPercentage = (validCompletedChapter/publishedChapterIds.length) *100
    return progressPercentage;
 } catch (error) {
    console.log("Error in getting progress ",error);
    return 0;
 }
}

export default GetProgress
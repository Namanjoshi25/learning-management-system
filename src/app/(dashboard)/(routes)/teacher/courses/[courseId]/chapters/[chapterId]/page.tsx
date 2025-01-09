import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ChapterTitleForm from "./_components/ChapterTitleForm";
import ChapterDescriptionForm from "./_components/ChapterDescriptionForm";
import { init } from "next/dist/compiled/webpack/webpack";
import ChapterAccessForm from "./_components/ChapterAccessForm";
import ChapterVideoForm from "./_components/ChapterVideoForm";
import Banner from "@/components/banner";
import ChapterActions from "./_components/ChapterActions";


const ChapterPage = async( 
  {params} : {params : {courseId :string , chapterId : string}
}) => {

  const {userId} = await auth();
  const {chapterId , courseId} = params
  if(!userId) return redirect("/")
    const chapter = await db.chapter.findUnique({
  where :{
    id:chapterId,
    courseId : courseId
  },
  include : {
    muxData :true
  }
})
  if(!chapter) return redirect("/")

    const requiredField = [
      chapter.title,
      chapter.videoUrl,
      chapter.description
    ]
    const totalFields = requiredField.length;
    const completedFields = requiredField.filter(Boolean).length

    const completedText =`(${completedFields}/${totalFields})`

    const isComplete  = requiredField.every(Boolean)
  return (
    <>
    {!chapter.isPublished && (
      <Banner
      variant="warning"
      label="This chapter is unpublished.It will not be visible in the course"
      />

    )}
    <div className=" p-6">
      <div className=" flex items-center justify-between">
        <div className=" w-full">
          <Link 
          href={`/teacher/courses/${courseId}`}
          className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
          <ArrowLeft className=" h-4 w-4 mr-2"/> 
          Back to course stepup
          </Link>
          <div className=" flex items-center justify-between w-full">
            <div className=" flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">
                Chapter Creation
              </h1>
              <span>
                Complete all fields {completedText}
              </span>
            </div>
            <ChapterActions
            disabled = {!isComplete}
            courseId ={courseId}
            chapterId={chapterId}
            isPublished={chapter.isPublished}
            />
          </div>  
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className=" space-y-4">
          <div>
            <div className=" flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard}/>
              <h2 className=" text-xl">Customize your chapter</h2>

            </div>
            <ChapterTitleForm
             initialData={chapter}
             courseId={courseId}
             chapterId={chapterId}
             />
             <ChapterDescriptionForm
             initialData={chapter}
             courseId={courseId}
             chapterId={chapterId}
             />
             
          </div>
          <div>
          <div className=" flex items-center gap-x-2">
          <IconBadge  icon={Eye} />  
          <h2 className=" text-xl">Access Settings</h2>

        </div>
        <ChapterAccessForm
        initialData={chapter}
        courseId={courseId}
        chapterId={chapterId}
        />
        </div>
       
        </div>
        <div>
          <div className="flex items-center gap-x-2 ">
            <IconBadge icon={Video}/>
            <h2 className=" text-xl">Add a video</h2>
          </div>
          <ChapterVideoForm
          initialData={chapter}
          courseId={courseId}
          chapterId={chapterId}
          />
        </div>
       

      </div>
        </div>
      </div>
   

      </div>
      </>
  )
}

export default ChapterPage
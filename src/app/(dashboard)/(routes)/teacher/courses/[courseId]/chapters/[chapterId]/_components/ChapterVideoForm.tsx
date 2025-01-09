"use client"
import * as z from 'zod'
import axios from 'axios' 
import { Button } from '@/components/ui/button'
import { Pencil, PlusCircle, Video } from 'lucide-react'
import { useState } from 'react'
import MuxPlayer from '@mux/mux-player-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Chapter, MuxData } from '@prisma/client'
import FileUpload from '@/components/file-upload'


interface ChapterVideoFormProps {
    initialData :Chapter & {muxData : MuxData | null}
    courseId : string
    chapterId : string
    
}
const formSchema = z.object({
    videoUrl: z.string()}
)
const ChapterVideoForm = ({initialData,courseId,chapterId} : ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter()
 const onSubmit = async (values : z.infer<typeof formSchema>)=>{
    try {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`,values)
        toast.success("Course Updated")
        setIsEditing(curr => !curr);
        router.refresh( )
        
        
    } catch (error) {
        console.log(error);
        toast.error("Something went wrong")
    }
 }
  return (
    <div className=' mt-6 bg-slate-100 rounded-md p-4'>
        <div className=' font-medium flex items-center justify-between'>
            Course image
            <Button onClick={()=>setIsEditing((curr)=> !curr)} variant="ghost">
                {isEditing && (<>Cancel</>)}
                {!isEditing && initialData?.videoUrl  && (
                    <>
                    <Pencil className=' h-4  w-4 mr-2'/>
                    Edit a Video </>
                )}
                {!isEditing && !initialData?.videoUrl  && (
                    <>
                    <PlusCircle className=' h-4  w-4 mr-2'/>
                    Add a Video </>
                )}
                
            </Button>
        </div>
        {!isEditing && (
              !initialData.videoUrl ? (
                  <div className=' flex items-center justify-center h-60 rounded-md bg-slate-200'>
                    <Video className=' h-10 w-10 text-slate-500' />
                  </div>
              ): (
                <div className=' relative aspect-video mt-2'>
                   <MuxPlayer
                   playbackId={initialData?.muxData?.playbackId || ""}

                   />

                </div> 
              )
        )}
        {isEditing && (

        
        <div>
            <FileUpload
            endpoint='chapterVideo'
            onChange={(url)=>{
                if(url) onSubmit({videoUrl : url})
            }}
             />
             <div className=' text-xs text-muted-foreground mt-4'>
             Upload this Chapter &apos; s video
            </div>
        </div>
        
        )}
        {initialData.videoUrl && !isEditing && (
            <div className=' text-xs text-muted-foreground mt-2'>
                Videos can take a few minuts to process.Refresh the page if video does not appear
            </div>
        )}
</div>
  ) 
}

export default ChapterVideoForm
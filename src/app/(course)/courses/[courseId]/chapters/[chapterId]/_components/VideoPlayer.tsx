"use client"
import MuxPlayer from "@mux/mux-player-react"
import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import  {useRouter} from 'next/navigation'
import { Loader2 ,Lock } from "lucide-react"

import { cn } from "@/lib/utils"
import { useConfettiStore } from "@/hooks/useConfettiStore"


interface VideoPlayerProps{
    chapterId :string,
    courseId :string,
    playbackId:string,
    nextChapterId?:string,
    isLocked:boolean
    title:string,
    completeOnEnd :boolean

}

const VideoPlayer = ({
    chapterId,
    courseId,
    playbackId , 
    nextChapterId , 
    isLocked,
    title,
    completeOnEnd
} : VideoPlayerProps) => {
    const [isReady ,setIsReady ] = useState(true)
    const router= useRouter()
    const confetti = useConfettiStore()

    const onEnd = async()=>{
      try {
        if(completeOnEnd){
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`,{
                isCompleted:true
            })
        }

        if(!nextChapterId) confetti.onOpen()

            toast.success("Progress updated")
            router.refresh();
            if(nextChapterId) router.push(`/api/courses/${courseId}/chapters/${nextChapterId}`)
        
      } catch (error) {
        toast.error("Something went wrong")
      }
    }
  
  return (
    <div className=" relative aspect-video">
        {!isReady && !isLocked && (
            <div className=" absolute inset-0 flex items-center justify-center bg-slate-800">
                <Loader2 className=" h-8 w-8 animate-spin text-secondary" />
            </div>
        )}
        {isLocked && (
           <div className=" absolute inset-0 flex items-center justify-center text-secondary bg-slate-800">
           <Lock className=" h-8 w-8 " />
           <p className=" text-sm">This chapter is locked</p>
       </div>
        )}
        {!isLocked && (
            <MuxPlayer
            title={title}
            className={cn(!isReady && "hidden")}
            onCanPlay={()=>setIsReady(true)}
            onEnded={onEnd}
            autoPlay
            playbackId={playbackId}
            
            

            />
        )}
</div>
  )
}

export default VideoPlayer
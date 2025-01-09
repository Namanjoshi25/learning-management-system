"use client"

import ConfirmModal from "@/components/modals/confirmModal"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

interface ChapterActionsProps{
    disabled : boolean,
    isPublished : boolean,
    courseId :string,
    chapterId :string
}

const ChapterActions = ({disabled , isPublished , courseId ,chapterId} : ChapterActionsProps) => {
    const [isLoading, setisLoading] = useState(false);
    const router = useRouter();
    const onDelete =async()=>{
    try {
        setisLoading(true)
        await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
        toast.success("Chapter Deleted")
        router.refresh();
        router.push(`/teacher/courses/${courseId}`)
    } catch (error) {
        toast.error("Something went wrong")
        console.log(error);
    }finally{
        setisLoading(false)
    }

    }
    const onPublish = async()=>{
        try {
            setisLoading(true);
            if(isPublished){
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
                toast.success("Chapter Unpublished")
            }else{
             await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`)
             toast.success("Chapter published")
             

            }
            router.refresh()
            
        } catch (error) {
            toast.error("Something went wrong")
            console.log(error);
            
        }finally{
            setisLoading(false)
        }
    }
  return (
    <div className=" flex items-center gap-x-2">
        <Button
        onClick={onPublish}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
        >
            {isPublished ? "Unpublish" : "Publish"}
        </Button>
        <ConfirmModal
        onConfirm={onDelete}
         >
        <Button disabled={isLoading}>
            <Trash className=" h-4 w-4 "/>
        </Button>
        </ConfirmModal>

    </div>
  )
}

export default ChapterActions
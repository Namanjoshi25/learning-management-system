"use client"

import ConfirmModal from "@/components/modals/confirmModal"
import { Button } from "@/components/ui/button"
import { useConfettiStore } from "@/hooks/useConfettiStore"
import axios from "axios"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

interface CourseActionsProps{
    disabled : boolean,
    isPublished : boolean,
    courseId :String,
   
}

const CourseActions = ({disabled , isPublished , courseId } : CourseActionsProps) => {
    const [isLoading, setisLoading] = useState(false);
    const confetti = useConfettiStore()
    const router = useRouter();
    const onDelete =async()=>{
    try {
        setisLoading(true)
        await axios.delete(`/api/courses/${courseId}`)
        toast.success("Course Deleted")
        router.refresh();
        router.push(`/teacher/courses`)
    } catch (error) {
        toast.error("Something went wrong")
    }finally{
        setisLoading(false)
    }

    }
    const onPublish = async()=>{
        try {
            setisLoading(true);
            if(isPublished){
                await axios.patch(`/api/courses/${courseId}/unpublish`)
                toast.success("Chapter Unpublished")
            }else{
             await axios.patch(`/api/courses/${courseId}/publish`)
             toast.success("Chapter published")
             confetti.onOpen()
             

            }
            router.refresh()
            
        } catch (error) {
            toast.error("Something went wrong")
            
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

export default CourseActions
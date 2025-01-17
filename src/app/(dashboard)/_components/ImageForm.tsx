"use client"
import * as z from 'zod'
import axios from 'axios' 
import { Button } from '@/components/ui/button'
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Course } from '@prisma/client'
import Image from 'next/image'
import FileUpload from '@/components/file-upload'


interface ImageFormProps {
    initialData :Course
    courseId : string
    
}
const formSchema = z.object({
    imageUrl: z.string()
})
const DescriptionForm = ({initialData,courseId} : ImageFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter()
 const onSubmit = async (values : z.infer<typeof formSchema>)=>{
    try {
        await axios.patch(`/api/courses/${courseId}`,values)
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
                {!isEditing && initialData?.imageUrl  && (
                    <>
                    <Pencil className=' h-4  w-4 mr-2'/>
                    Edit a Image </>
                )}
                {!isEditing && !initialData?.imageUrl  && (
                    <>
                    <PlusCircle className=' h-4  w-4 mr-2'/>
                    Add a Image </>
                )}
                
            </Button>
        </div>
        {!isEditing && (
              !initialData.imageUrl ? (
                  <div className=' flex items-center justify-center h-60 rounded-md bg-slate-200'>
                    <ImageIcon className=' h-10 w-10 text-slate-500' />
                  </div>
              ): (
                <div className=' relative aspect-video mt-2'>
                    <Image
                    alt='upload'
                    fill
                     

                    className=' object-cover rounded-md'
                    src={initialData.imageUrl}

                     />

                </div> 
              )
        )}
        {isEditing && (

        
        <div>
            <FileUpload
            endpoint='courseImage'
            onChange={(url)=>{
                if(url) onSubmit({imageUrl : url})
            }}
             />
             <div className=' text-xs text-muted-foreground mt-4'>
             16:9 aspect ratio recommended
            </div>
        </div>
        
        )}
</div>
  ) 
}

export default DescriptionForm
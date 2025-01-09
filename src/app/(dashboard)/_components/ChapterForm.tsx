"use client"
import * as z from 'zod'
import axios from 'axios'
import { Chapter, Course } from '@prisma/client'
import { zodResolver } from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {
    Form ,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import ChapterList from './ChaptersList'
import { Loader2, PlusCircle } from 'lucide-react'



interface ChapterFormProps {
    initialData : Course & {chapters : Chapter[]}

    
    courseId : string
    
}
const formSchema = z.object({
   title : z.string().min(1)
})
const ChapterForm = ({initialData,courseId} : ChapterFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const router = useRouter()


 const form  = useForm<z.infer<typeof formSchema>>({
    resolver : zodResolver(formSchema),
    defaultValues:{
        title :  ""
    }
 })
 const {isSubmitting,isValid}  = form.formState;

 const onSubmit = async (values : z.infer<typeof formSchema>)=>{
    try {
        await axios.post(`/api/courses/${courseId}/chapters`,values)
        toast.success("Chapter Created")
        setIsCreating(curr => !curr);
        router.refresh( )
        
        
    } catch (error) {
        console.log(error);
        toast.error("Something went wrong")
    }
 }
 const onReorder = async(updatedData : {id :string,position :number}[])=>{
try {
    setIsUpdating(true)
    await axios.put(`/api/courses/${courseId}/chapters/reorder`,{
        list:updatedData
    })
    toast.success("Chapter reorderd")
    router.refresh()
    
} catch (error) {
    console.log(error);
toast.error("Something went wrong")
}finally{ setIsUpdating(false)}

 }
 const OnEdit = (id :string)=>{
    router.push(`/teacher/courses/${courseId}/chapters/${id}`)
 }
  return (
    <div className=' relative mt-6 bg-slate-100 rounded-md p-4'>
        {isUpdating && (
       <div className=' absolute h-full w-full bg-slate-50/20 top-0 right-0 rounded-md flex items-center justify-center'>
        <Loader2 className=' animate-spin h-6 w-6 text-sky-700'/>
       </div>
        )}
        <div className=' font-medium flex items-center justify-between'>
            Course Chapters
            <Button onClick={()=>setIsCreating ((curr)=> !curr)} variant="ghost">
                {isCreating && (<>Cancel</>)}
                {!isCreating && (
                    <>
                    <PlusCircle className=' h-4  w-4 mr-2'/>
                    Add a Chapter </>
                )}
                
            </Button>
        </div>
        
        {isCreating && (

        <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4">
                
                
                <FormField
                control={form.control}
                name ="title"
                render={({field})=>(
                    <FormItem>
                        <FormControl>
                            <Input
                            placeholder='e.g. Introduction to course'
                            {...field}
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
        )}
                />
               
                    <Button
                     disabled={(!isValid || isSubmitting)}
                     type='submit'
                    >Create</Button>
             
            </form>

        </Form>
        )}
        {!isCreating && (
            <div className={cn(
                "text-sm mt-2" ,
                !initialData.chapters.length && "text-slate-500 italic"
            )}>
                {!initialData.chapters.length && "No chapters"}
                <ChapterList
                onEdit={OnEdit}
                onReorder={onReorder}
                items={initialData.chapters || {}}
                />
               
                </div>
        )}
        {!isCreating && (
            <p className=' text-xs text-muted-foreground mt-4'>Drag and drop to reorder the chapters</p>
        )}
</div>
  )
}

export default ChapterForm
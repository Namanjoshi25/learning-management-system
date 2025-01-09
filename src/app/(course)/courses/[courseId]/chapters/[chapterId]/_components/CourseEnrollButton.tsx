"use client"
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/format'
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const CourseEnrollButton = ({price , courseId} : {price:number,courseId:string}) => {
  
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async()=>{
    try {
      setIsLoading(true);

      setTimeout(async()=>{
        const res = await axios.post(`/api/courses/${courseId}/checkout`)
        if(res)toast.success("Course purchased")

      }, 3*1000)
      
    } catch (error) {
      toast.error("Something went wrong")
      console.log(error);
      setIsLoading(false)
    }
  }
  return (
    <Button
     size="sm" 
     className=' w-full md:w-auto'
     onClick={onClick}
     disabled={isLoading}
     >
        Enroll for {formatPrice(price)}
    </Button>
  )
}

export default CourseEnrollButton
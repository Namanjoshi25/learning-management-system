
import React from 'react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/column'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

async function page() {
  
  const {userId} = await auth()
  if(!userId) return redirect("/")

    const courses = await db.course.findMany({
      where :{
        userId : userId
      },
      orderBy:{
        createdAt: "desc"
      }
    })
  return (
    <div className=' p-6'>

  
      
         <DataTable columns={columns} data={courses} />
 
    </div>
  )
}

export default page
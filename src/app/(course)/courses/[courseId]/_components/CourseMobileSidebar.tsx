import { Chapter, Course, UserProgress } from '@prisma/client';
import React from 'react'

import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react';
import CourseSidebar from './CourseSidebar';

interface CourseMobileSidebarProps {
    course :Course & {
        chapters :  (Chapter & {
            userProgress : UserProgress[] | null
        })[]
    } ;
     progressCount:number
}
const CourseMobileSidebar = ({progressCount , course} : CourseMobileSidebarProps) => {
  return (
    <Sheet>
        <SheetTrigger className=' md:hidden pr-4 hover:opacity-75 transition'>
            <Menu/>
        </SheetTrigger>
        <SheetContent className=' p-0 w-72 bg-white ' side="left">
            <CourseSidebar
            course={course}
            progressCount={progressCount}
            />
        </SheetContent>
    </Sheet>
  )
}

export default CourseMobileSidebar
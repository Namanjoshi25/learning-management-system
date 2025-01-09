"use client"
import { BarChart, Compass, Layout, List } from 'lucide-react'
import React from 'react'
import SidebarItem from './Sidebar-Item'
import { usePathname } from 'next/navigation'

const guestRoutes = [
  {
      icon : Layout,
      label : "Dashboard",
      href : "/"
  },
  {
      icon : Compass,
      label : "Browse",
      href : "/search"
  }
]
const teacherRoutes =[
{
  icon : List,
  label : "Courses",
  href : "/teacher/courses"
},
{
  icon : BarChart,
  label : "Analytics",
  href : "/teacher/analytics"
}
]
function SidebarRoutes() {
  const pathname = usePathname()
  const isTeacher = pathname?.includes("/teacher")
  const routes = isTeacher ? teacherRoutes : guestRoutes;
  return (
    
    <div className=' flex flex-col w-full'>
        {routes.map((route)=>(
          <SidebarItem
          key={route.href}
          label={route.label}
          icon={route.icon}
          href={route.href}
          />
        ))}
    </div>
  )
}

export default SidebarRoutes
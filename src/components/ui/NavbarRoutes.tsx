"use client"
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Button } from './button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import SearchInput from '@/app/(dashboard)/(routes)/search/_components/SearchInput';

function NavbarRoutes() {
    const pathname = usePathname();
    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursePage = pathname?.includes("/courses")
    const isSearchPage = pathname === "/search"
  return (
    <>
    {isSearchPage && (
        <div className=' hidden md:block'>
        <SearchInput />
        </div>
    )}
    <div className=' flex gap-x-2 ml-auto'>
        {isTeacherPage || isCoursePage?(
            <Link href="/">
            <Button size="sm" variant="ghost">
                <LogOut className=' h-4 w-4 mr-2'/>
                Exit
            </Button>
            </Link>

        ) : (
            <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">Teacher Mode</Button>
            </Link>

        )}
        <UserButton
        afterSignOutUrl='/'
        />
    </div>
    </>
  )
}

export default NavbarRoutes
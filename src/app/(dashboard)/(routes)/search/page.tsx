import { db } from "@/lib/db"
import Categories from "./_components/Categories"
import SearchInput from "./_components/SearchInput"
import { GetCourse } from "@/actions/GetCourses"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import CoursesList from "@/components/coursesList"
import { Suspense } from "react"

interface SearchParamsProps {
 searchParams:{
  title :string
  categoryId :string
 }
}

async function Search ({searchParams} :SearchParamsProps) {

  const {userId} =await auth();
  if(!userId) return redirect("/")

  const categories  = await db.category.findMany({
    orderBy:{
      name :"asc"
    }
  })

  const courses = await GetCourse({
    userId,
    ...searchParams
  }
  )

  return (
    <>
   <div className="px-6 pt-6 block md:hidden md:mb-0">
  <Suspense fallback={<div className="text-center text-gray-500">Loading search input...</div>}>
    <SearchInput />
  </Suspense>
</div>

<div className="p-6 space-y-4">
  {categories && categories.length > 0 ? (
    <Categories items={categories} />
  ) : (
    <div className="text-center text-gray-500">No categories available</div>
  )}

  {courses && courses.length > 0 ? (
    <CoursesList items={courses} />
  ) : (
    <div className="text-center text-gray-500">No courses found</div>
  )}
</div>

    </>
  )
}

export default Search
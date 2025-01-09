import { db } from "@/lib/db"
import Categories from "./_components/Categories"
import SearchInput from "./_components/SearchInput"
import { GetCourse } from "@/actions/GetCourses"
import { auth } from "@clerk/nextjs/server"
import { redirect, useSearchParams } from "next/navigation"
import CoursesList from "@/components/coursesList"

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
    <div className=" px-6 pt-6 md:hidden md:mb-0 block">
      <SearchInput/>
    </div>
    <div className=" p-6 space-y-4">
      <Categories
      items={categories}
      />
      <CoursesList
      items = {courses}
      />

    </div>
    </>
  )
}

export default Search
"use client"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import qs from "query-string"
import { useEffect, useState } from "react"


const SearchInput = () => {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value)


    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname  = usePathname()

    const currentCategoryId = searchParams.get("categoryId")

useEffect(()=>{
    const url = qs.stringifyUrl({
        url :pathname,
        query:{
            categoryId : currentCategoryId,
            title : debouncedValue
        }
    },{skipEmptyString:true ,skipNull:true})

    router.push(url)

},[debouncedValue,currentCategoryId,router,pathname])
    
  return (
    <div className="relative">
        <Search className=" left-3 h-4 w-4 absolute top-3 text-slate-600"/>
        <Input
        value={value}
        onChange={(e)=>setValue(e.target.value)}
         className=" w-full pl-9 md:w-[300px] rounded-full bg-slate-100 focus-visible:ring-slate-200"
         placeholder="Search for a course"
        
        />
    </div>
  )
}

export default SearchInput
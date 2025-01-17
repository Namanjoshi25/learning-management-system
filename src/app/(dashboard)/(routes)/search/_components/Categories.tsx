"use client"
import { Category } from "@prisma/client"
import { 
    FcEngineering ,
     FcFilmReel ,
      FcMultipleDevices,
      FcSportsMode,
      FcMusic,
      FcOldTimeCamera,
      FcSalesPerformance,


    } from 'react-icons/fc'
    import { IconType } from "react-icons/lib"
import { CategoryItem } from "./CategoryItem"

    const iconMap : Record<Category["name"],IconType>={
        "Music" :FcMusic,
        "Photography" : FcOldTimeCamera,
         "Fitness" : FcSportsMode,
         "Accounting" : FcSalesPerformance,
         "Filming" : FcFilmReel,
         "Engineering" : FcEngineering,
         "Computer Science" : FcMultipleDevices
    }
const Categories = ({items} : {items : Category[]}) => {
  return (
    <div className=" flex items-center gap-x-2 overflow-x-auto pb-2">
        {items.map((item)=>(
            <CategoryItem
            key={item.id}
            label={item.name}
            icon={iconMap[item.name]}
            value={item.id}
            />
        ))}
        </div>
  )
}

export default Categories
"use client"

import { Button } from "@/components/ui/button"
import { Course } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"

import {
   DropdownMenu ,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger


  } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/format"

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
  header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell:({row})=>{
      return (
        <div className="ml-3">
         { row.getValue("title")}
        </div>
      )
    }
  },
  {
    accessorKey: "price",
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell :({row})=>{
      const price = parseFloat(row.getValue("price") || "0")
      const formattedPrice= formatPrice(price)
         return (
           <div className=" ml-3">
            {formattedPrice}
           </div>
         )
    }
   
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Published
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell :({row})=>{
      const isPublished = row.getValue("isPublished") || false

      return(
        <Badge className={cn("bg-slate-500 ml-3", isPublished && "bg-sky-700" )}>
          {isPublished ? "Published":"Draft"}
        </Badge>
      )
    }
  },
  {
    id: "actions",
    cell :({row})=>{
      const {id} = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className=" h-4 w-8 p-0">
              <span className="sr-only">
                 Open menu
              
              </span>
              <MoreHorizontal className=" h-4 w-4"/>
            </Button>

          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/teacher/courses/${id}`}>
            <DropdownMenuItem>
              <Pencil className=" h-4 w-4 mr-2"/>
              Edit

            </DropdownMenuItem>
            </Link>

          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

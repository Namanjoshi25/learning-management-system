import { GetDashboardCourses } from "@/actions/GetDashboarCourses";
import CoursesList from "@/components/coursesList";
import { auth } from "@clerk/nextjs/server";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import InfoCard from "./_components/InfoCard";


export default async function Dashboard() {

  const {userId} = await auth();
  if(!userId) return redirect("/")
  const {completedCourses , coursesInProgress} = await GetDashboardCourses(userId)
  return (
 <div className=" p6 space-y-4">
  <div className=" grid grid-cols-1 sm:grid-cols-2 gap-4">
   <InfoCard
   icon={Clock}
   variant='default'
   label="In progress"
   numberOfItems={coursesInProgress.length}
   />
   <InfoCard
   icon={CheckCircle}
   variant='success'
   label="Completed"
   numberOfItems={completedCourses.length}
   />

  </div>
  
  <CoursesList
   items={ [...coursesInProgress,...completedCourses ]}
  />
  
   </div>
  );
}

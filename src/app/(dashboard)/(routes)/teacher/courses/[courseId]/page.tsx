import DescriptionForm from "@/app/(dashboard)/_components/DescriptionForm";
import TitleForm from "@/app/(dashboard)/_components/TitleForm";
import ImageForm from "@/app/(dashboard)/_components/ImageForm";
import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListCheck,
  ListChecks,
} from "lucide-react";
import { redirect, useParams } from "next/navigation";
import CategoryForm from "@/app/(dashboard)/_components/CategoryForm";
import PriceForm from "@/app/(dashboard)/_components/PriceForm";
import AttackmentForm from "@/app/(dashboard)/_components/AttachmentForm";
import ChapterForm from "@/app/(dashboard)/_components/ChapterForm";
import Banner from "@/components/banner";
import CourseActions from "@/app/(dashboard)/_components/CourseActions";

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const { userId } = await auth();
  if (!userId) return redirect("/");
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId : userId
    },
    include: {
        chapters:{
            orderBy:{
                position :"asc"
            }
        },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  if (!course) return redirect("/");

  const requiredFields = [
    course.categoryId,
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.chapters.some(chapter => chapter.isPublished)
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completedText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean)

  return (
    <>
    {!course.isPublished && (
      <Banner
      label="This course is unpublished.It will not be visible to students"
      />
    )}
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className=" text-2xl  font-medium">Course setup</h1>
          <span className=" text-sm text-slate-700">
            Complete all fields {completedText}
          </span>
        </div>
        {/* Add Actions here*/}
        <CourseActions
        isPublished={course.isPublished}
        disabled={!isComplete}
        courseId={params.courseId}
        />
      </div>

      <div className=" grid grid-col-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className=" text-xl">Customize your course</h2>
          </div>
          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <div className="space-y-6  ">
          <div>
            <div className=" flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Course Chapters</h2>
            </div>
            <ChapterForm initialData={course} courseId={course.id} />
          </div>

          <div>
            <div className=" flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className=" text-xl">Sell your course</h2>
            </div>
            <PriceForm initialData={course} courseId={course.id} />
          </div>
          <div>
            <div className=" flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className=" text-xl">Resourses and Attackments</h2>
            </div>
            <AttackmentForm initialData={course} courseId={course.id} />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

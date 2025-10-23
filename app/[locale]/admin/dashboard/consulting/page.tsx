import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SquarePen, Plus } from "lucide-react";
import Image from "next/image";
import { getAllcategories } from "@/app/models/db/lib/services/Accommodation";
import DeleteCategoryButton from "@/components/consulting/deleteCategoryForm";
import { deleteCategory } from "./(fetch)/deleteCategory";

export default async function ConsultingTable() {
  const categories = await getAllcategories();

  return (
    <main className="flex flex-col justify-center items-center xl:ml-5 m-2">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Categories</h1>
        <h2 className="text-sm md:text-lg text-gray-600">
          A list of your Categories.
        </h2>
      </div>

      {/* If no categories */}
      {categories.length === 0 ? (
        <div className="w-full text-center py-10 text-gray-500 text-lg min-w-[75vw]">
          No categories found. Please add a new category.
        </div>
      ) : (
        /* Table container */
        <div className="w-full overflow-x-auto border border-gray-300 rounded-2xl p-2">
          <div className="min-w-[75vw]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden xl:table-cell">
                    Description
                  </TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs sm:text-base">
                      {category.category_name_en}
                    </TableCell>

                    {/* Description */}
                    <TableCell className="text-xs sm:text-base hidden xl:table-cell">
                      {category.description_en?.substring(0, 50)}...
                    </TableCell>

                    {/* Image */}
                    <TableCell className="text-xs sm:text-base">
                      <Image
                        src={category.image ?? "/placeholder-image.png"}
                        alt={category.category_name_en}
                        width={75}
                        height={75}
                        className="rounded-full object-cover"
                      />
                    </TableCell>

                    {/* Edit Icon */}
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={`/admin/dashboard/consulting/${category.id}`}
                            >
                              <SquarePen className="w-5 h-5 text-[#125892] cursor-pointer hover:text-[#0f4473]" />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center">
                            <p>Edit</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>

                    {/* Delete Icon */}
                    <TableCell>
                      <DeleteCategoryButton
                        categoryId={category.id ?? ""}
                        deleteAction={deleteCategory}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Add Button under the table */}
      <div className="w-full flex justify-end mt-4">
        <Link
          href="/admin/dashboard/consulting/newConsulting"
          className="bg-[#125892] hover:bg-[#0f4473] text-white px-5 py-3 rounded-md flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add
        </Link>
      </div>
    </main>
  );
}

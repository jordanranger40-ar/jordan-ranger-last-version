"use client";

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
import { Plus, SquarePen, GripVertical } from "lucide-react";
import React, { useState, useTransition } from "react";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { type newMemberDragAndDrop } from "@/types/index";
import { deleteMember } from "@/app/[locale]/admin/dashboard/ourTeam/(fetch)/deleteMember";
import DeleteMemberButton from "./deleteMemberButton";
import { updateMemberOrder } from "@/app/[locale]/admin/dashboard/ourTeam/(fetch)/updateMemberOrder";
import { useRouter } from "next/navigation";

interface Props {
  members: newMemberDragAndDrop[];
}

export default function DragDropOurteam({ members: initialMembers }: Props) {
  const [members, setMembers] = useState(initialMembers);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();

  // Drag end handler
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = members.findIndex((c) => c.id === active.id);
      const newIndex = members.findIndex((c) => c.id === over.id);
      setMembers(arrayMove(members, oldIndex, newIndex));
    }
  };

  // Save order
  const handleSaveOrder = async () => {
    const body = members.map((member, index) => ({
      id: member.id,
      display_order: index + 1,
    }));
    startTransition(async () => {
      try {
        await updateMemberOrder(body);
        setToast({ message: "Members Ordered successfully!", type: "success" });

        setTimeout(() => {
          setToast(null);
          router.replace("/admin/dashboard/ourTeam");
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error(error);
        setToast({ message: "Failed to Order Member.", type: "error" });
        setTimeout(() => setToast(null), 3000);
      }
    });
  };

  // Sortable row
  const SortableRow = ({ member }: { member: newMemberDragAndDrop }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: member.id });

    const style = {
      transform: transform ? `translateY(${transform.y}px)` : undefined,
      transition,
    };

    return (
      <TableRow ref={setNodeRef} style={style}>
        {/* Drag handle cell */}
        <TableCell
          className="cursor-grab active:cursor-grabbing text-center"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="mx-auto text-gray-500 hover:text-gray-700" />
        </TableCell>

        <TableCell className="text-xs sm:text-base">{member.name_en}</TableCell>
        <TableCell className="text-xs sm:text-base hidden xl:table-cell">{member.position_en}</TableCell>
        <TableCell className="text-xs sm:text-base text-center">{member.main ? "Yes" : "No"}</TableCell>
        <TableCell className="flex justify-center">
          <img
            src={member.image ?? ""}
            alt={member.name_en}
            className="rounded-full object-cover w-10 h-10 md:w-20 md:h-20"
          />
        </TableCell>
        <TableCell className="text-xs sm:text-base text-center">{member.display_order ?? "-"}</TableCell>

        {/* Non-draggable actions */}
        <TableCell>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/admin/dashboard/ourTeam/${member.id}`}>
                    <SquarePen className="w-5 h-5 text-[#125892] cursor-pointer hover:text-[#0f4473]" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p>Edit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DeleteMemberButton memberId={member.id} deleteAction={deleteMember} />
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div>
      <div className="w-full overflow-x-auto border border-gray-300 rounded-2xl p-2 flex justify-center">
        <div className="min-w-[70vw] md:min-w-[78vw]">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={members} strategy={verticalListSortingStrategy}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead> {/* Drag handle */}
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden xl:table-cell">Position</TableHead>
                    <TableHead className="text-center">Main Member</TableHead>
                    <TableHead className="text-center">Image</TableHead>
                    <TableHead className="text-center">Sequence</TableHead>
                    <TableHead></TableHead> {/* Actions */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <SortableRow key={member.id} member={member} />
                  ))}
                </TableBody>
              </Table>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      <div className="flex flex-row justify-end gap-2">
        <div className="flex justify-end mt-4 cursor-pointer">
          <button
            onClick={handleSaveOrder}
            className="bg-[#125892] hover:bg-[#0f4473] text-white px-5 py-3 rounded-md cursor-pointer"
          >
            {isPending ? `Loading...` : "Save Order"}
          </button>
        </div>
        <div className="flex justify-end mt-4">
          <Link
            href="/admin/dashboard/ourTeam/newMember"
            className="bg-[#125892] hover:bg-[#0f4473] text-white px-5 py-3 rounded-md flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add
          </Link>
        </div>
      </div>

      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

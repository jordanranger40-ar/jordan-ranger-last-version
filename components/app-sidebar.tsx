"use client";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Tag,
  Ticket,
  Users,
  LayoutDashboard,
  UserCheck,
  Handshake,
  BookOpen,
  PenLine,
  Crown,
  House,
  FilePen,
  Settings,
} from "lucide-react";

import logoDash from "@/public/images/logosidebar.png";

const items = [
  { title: "Home", url: "/", icon: House },
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Users", url: "/admin/dashboard/users", icon: UserCheck },
  { title: "Banners", url: "/admin/dashboard/banners", icon: Ticket },
  {
    title: "Rooms Features",
    url: "/admin/dashboard/room_features",
    icon: Settings,
  },
  { title: "Rooms ", url: "/admin/dashboard/rooms", icon: Settings },
    { title: "Room Booking ", url: "/admin/dashboard/roomsBooking", icon: Settings },

  { title: "Consulting", url: "/admin/dashboard/consulting", icon: Tag },
  { title: "Services", url: "/admin/dashboard/services", icon: Handshake },
  { title: "Training", url: "/admin/dashboard/training", icon: PenLine },
  { title: "Courses", url: "/admin/dashboard/courses", icon: BookOpen },
  { title: "My Team", url: "/admin/dashboard/ourTeam", icon: Users },
  { title: "Clients", url: "/admin/dashboard/clients", icon: Crown },
  {
    title: "Applications",
    url: "/admin/dashboard/applications",
    icon: FilePen,
  },
  { title: "Settings", url: "/admin/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-[#125892] text-lg mb-3   p-2 rounded ">
            <Image src={logoDash} alt="logo" className="w-8 h-8" />
            <span>Think Impact</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      onClick={() => router.replace(item.url)}
                      className={isActive ? "bg-[#E0F2FE] text-black" : ""}
                    >
                      <button className="flex items-center gap-2 w-full text-left p-2 rounded cursor-pointer">
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

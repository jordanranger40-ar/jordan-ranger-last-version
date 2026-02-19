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
 
  Ticket,
  LayoutDashboard,
  UserCheck,
  
  PenLine,
  Crown,
  House,
  Settings,
  Warehouse,
  CalendarClock,
  Activity
} from "lucide-react";

import logoDash from "@/public/images/reversed logo.png";

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
  { title: "Rooms ", url: "/admin/dashboard/rooms", icon: Warehouse },
  {
    title: "Room Bookings ",
    url: "/admin/dashboard/roomsBooking",
    icon: CalendarClock,
  },

  { title: "Training", url: "/admin/dashboard/training", icon: PenLine },
  {
    title: "Training Bookings",
    url: "/admin/dashboard/trainingsBooking",
    icon: CalendarClock,
  },
  { title: "Activities", url: "/admin/dashboard/activities", icon: Activity },
  {
    title: "Activities Bookings",
    url: "/admin/dashboard/activitiesBooking",
    icon: CalendarClock,
  },
  { title: "Disable Dates", url: "/admin/dashboard/disable_booking", icon: Activity },
  { title: "All Bookings ", url: "/admin/dashboard/bookingConfirmation", icon: Warehouse },

  { title: "Clients", url: "/admin/dashboard/clients", icon: Crown },
  {
    title: "Settings",
    url: "/admin/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center  text-[#676e32]  rounded ">
            <Image src={logoDash} alt="logo" className="w-24 h-10" />
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

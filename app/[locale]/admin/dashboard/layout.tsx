import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "sonner";

export default async function Layout({ children }: { children: React.ReactNode }) {

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
      <Toaster
            position="bottom-right"
            richColors
            
          
            duration={3000}
          />
    </SidebarProvider>
  )
}

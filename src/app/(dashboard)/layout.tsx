import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";


interface props {
    children :React.ReactNode;
}

const Layout =({ children }:props)=>{
    return (
        <SidebarProvider>
            <DashboardSidebar/>
            <main className="flex flex-col h-screen w-screen">
            {children}
            </main>
        </SidebarProvider>
    )
}

export default Layout
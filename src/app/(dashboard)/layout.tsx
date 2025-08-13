import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";


interface props {
    children :React.ReactNode;
}

const Layout =({ children }:props)=>{
    return (
        <SidebarProvider>
            <DashboardSidebar/>
            <main className="flex flex-col h-screen w-screen">
                <DashboardNavbar/>
            {children}
            </main>
        </SidebarProvider>
    )
}

export default Layout
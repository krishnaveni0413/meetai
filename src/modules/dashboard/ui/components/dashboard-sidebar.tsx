"use client";
import { Sidebar,SidebarContent,SidebarFooter,SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@/components/ui/sidebar";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; 
import { Separator } from "@/components/ui/separator";
import {cn} from "@/lib/utils"
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";

const firstSection = [
     {
        icon :VideoIcon,
        label:"Meetings",
        href:"/meetings",
    },
    {
        icon :BotIcon,
        label:"Agents",
        href:"/agents",
    },
]
const secondSection = [
     {
        icon :StarIcon,
        label:"Upgrade",
        href:"/upgrade",
    },
]

export const DashboardSidebar =()=>{
    const pathname = usePathname()
    // const pathname="/agents";
    return(
        <Sidebar>
            <SidebarHeader className="text-sidebar-accent-foreground">
                <Link href="/" className="flex items-center gap-2 pt-2">
                <Image src="/logo.svg" height={36} width={36} alt="Meet.AI"/>
                <p>Meet.AI</p>
                </Link>

            </SidebarHeader>
            <div className="px-4 py-3">
                <Separator className="opaciy-10 text-[#5D6B68]"/>
            </div>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {firstSection.map((item)=>(
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton 
                                asChild
                                className={cn(
                                "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6BC8]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                pathname===item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10"
                            )}
                            isActive={pathname===item.href}
                            >
                                <Link href={item.href}>
                                <item.icon className="size-5 "/>
                                <span className="text-sm font-medium tracking-tight">
                                    {item.label}
                                </span>
                                
                                </Link>
                            </SidebarMenuButton>
                            </SidebarMenuItem>
                            
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
                <div className="px-4 py-3">
                    <Separator className="opaciy-10 text-[#5D6B68]"/>
                </div>
                <SidebarGroup>
                    <SidebarMenu>
                        {secondSection.map((item)=>(
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton 
                            asChild
                                className={cn(
                                "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6BC8]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                pathname===item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10"
                            )}
                            isActive={pathname===item.href}
                            >
                                <Link href={item.href}>
                                <item.icon className="size-5 "/>
                                <span className="text-sm font-medium tracking-tight">
                                    {item.label}
                                </span>
                                
                                </Link>
                            </SidebarMenuButton>
                            </SidebarMenuItem>
                            
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter className="text-white ">
                <DashboardUserButton/>
            </SidebarFooter>
        </Sidebar>
    )
};
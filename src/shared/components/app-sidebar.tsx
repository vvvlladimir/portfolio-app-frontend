'use client';

import {
  LayoutDashboard,
  Settings,
  PieChart,
  BarChart3,
  FileText,
  HelpCircle,
  Receipt
} from "lucide-react";

import {
  Sidebar,
  SidebarContent, SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, SidebarSeparator, SidebarTrigger,
  useSidebar
} from "@/shared/components/ui/sidebar"
import { usePathname } from 'next/navigation';
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    url: "transactions",
    icon: Receipt,
  },
  {
    title: "Analytics / Charts",
    url: "analytics",
    icon: BarChart3,
  },
  {
    title: "Diversification Settings",
    url: "diversification",
    icon: PieChart,
  },
  {
    title: "Reports",
    url: "reports",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "settings",
    icon: Settings,
  },
  {
    title: 'Help',
    url: 'help',
    icon: HelpCircle,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const {state} = useSidebar()


  let header = <SidebarTrigger className={"size-14 w-full"}/>
  let footer = null
  if (state == "expanded"){
    header = (
        <>
          <div className="p-2">
            <h1 className="text-lg font-semibold">Portfolio Tracker</h1>
            <p className="text-sm text-muted-foreground">Investment Management</p>
          </div>
        </>
    )
    footer = (
        <>
          <p>© 2025 Portfolio Tracker</p>
          <p>Version 1.0.0</p>
        </>
    )
  }

  return (
      <Sidebar
          variant="sidebar"
          collapsible="icon"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarHeader className={"p-0"}>
              {header}
            </SidebarHeader>
            <SidebarSeparator/>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const target = `/${item.url}`
                  const isActive = pathname === target || pathname.startsWith(`${target}/`)
                  return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className={"h-14 group-data-[collapsible=icon]:h-14"}
                        >
                          <Link href={item.url}>
                            <item.icon/>
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                  )

                })}
              </SidebarMenu>
            </SidebarGroupContent>
            <SidebarFooter className={"border-t border-muted text-xs text-muted-foreground"}>
              {footer}
            </SidebarFooter>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
  )
}
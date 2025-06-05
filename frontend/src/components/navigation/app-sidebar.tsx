import { Group, Home, Inbox } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import Link from "next/link";
import { useSessionStore } from "@/store/session";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Public Teams",
    url: "/teams",
    icon: Group,
  },
];

export function AppSidebar() {
  const { user } = useSessionStore();

  return (
    <Sidebar>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {user?.role === "admin" && (
                <SidebarMenuItem key="Admin Panel">
                  <SidebarMenuButton asChild>
                    <Link href="/admin">
                      <Inbox />
                      <span>Admin Panel</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <h3 className="text-lg font-medium">Teagbag</h3>
      </SidebarFooter>
    </Sidebar>
  );
}

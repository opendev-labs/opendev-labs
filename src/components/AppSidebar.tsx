import { Home, Compass, Terminal, HardDrive, Settings, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { useAuth } from "@/features/void/hooks/useAuth"

const items = [
  {
    title: "OpenStudio",
    url: "/open-studio",
    icon: Terminal,
  },
  {
    title: "OpenHub",
    url: "/open-hub",
    icon: Compass,
  },
  {
    title: "Void Deployments",
    url: "/void",
    icon: HardDrive,
  },
]

export function AppSidebar() {
  const { user } = useAuth()

  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex items-center justify-center border-b border-sidebar-border">
         <Link to="/" className="flex items-center gap-2">
            <Terminal className="text-emerald-500" size={24} />
            <span className="font-bold text-lg">OpenDev</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
          {user ? (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link to={`/user/${user.uid}`}>
                            <User />
                            <span>Profile</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link to="/settings">
                            <Settings />
                            <span>Settings</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          ) : (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link to="/auth">
                            <User />
                            <span>Log in</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          )}
      </SidebarFooter>
    </Sidebar>
  )
}

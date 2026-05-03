import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, MonitorSmartphone, UserCircle, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
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
  useSidebar,
} from "@/components/ui/sidebar";
import logo from "@/assets/spot-logo.png";

const mainItems = [
  { title: "Dashboard Analitik", url: "/dashboard", icon: BarChart3 },
  { title: "Daftar Perangkat", url: "/devices", icon: MonitorSmartphone },
];

const accountItems = [
  { title: "Profil Akun", url: "/profile", icon: UserCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  const isActive = (path: string) =>
    path === "/devices"
      ? pathname.startsWith("/devices") || pathname.startsWith("/track") || pathname.startsWith("/log")
      : pathname === path;

  const renderItem = (item: typeof mainItems[number]) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        asChild
        isActive={isActive(item.url)}
        className="h-12 rounded-xl data-[active=true]:bg-[image:var(--gradient-active)] data-[active=true]:text-sidebar-foreground hover:bg-sidebar-accent"
      >
        <NavLink to={item.url} className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
            <item.icon className="h-5 w-5" />
          </span>
          {!collapsed && <span className="font-semibold flex-1">{item.title}</span>}
          {!collapsed && <span className="text-sidebar-foreground/70">›</span>}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-6">
        <NavLink to="/dashboard" className="flex items-center justify-center">
          <img src={logo} alt="SPOT" className={collapsed ? "h-10" : "h-16"} width={200} height={80} />
        </NavLink>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">{mainItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/90 text-sm font-normal border-b border-sidebar-border pb-2 mb-2">
              Pengaturan Akun
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {accountItems.map(renderItem)}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="h-12 rounded-xl hover:bg-sidebar-accent"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                    <LogOut className="h-5 w-5" />
                  </span>
                  {!collapsed && <span className="font-semibold flex-1 text-left">Logout</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

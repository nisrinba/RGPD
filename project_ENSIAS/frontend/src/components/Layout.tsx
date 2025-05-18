
import React from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { LayoutDashboard, Upload, FileText, Settings, Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-y-auto ml-0 sm:ml-[52px] lg:ml-[72px]">
          <div className="space-y-8">
            <div className="flex items-center mb-8">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-2xl font-bold">Détection de Données Sensibles</h1>
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const AppSidebar = () => {
  const menuItems = [
    {
      title: "Tableau de Bord",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Nouvelle Analyse",
      url: "/analyse",
      icon: Upload,
    },
    {
      title: "Rapports",
      url: "/rapports",
      icon: FileText,
    },
    {
      title: "Configuration",
      url: "/configuration",
      icon: Settings,
    },
  ];

  return (
    <Sidebar variant="compact">
      <SidebarContent>
        <div className="px-3 py-4 flex items-center justify-center">
          <Shield className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold hidden">SensiScan</span>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="hidden">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center justify-center gap-3" title={item.title}>
                      <item.icon className="h-5 w-5" />
                      <span className="hidden">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default Layout;

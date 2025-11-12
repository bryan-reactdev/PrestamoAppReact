import { Link } from "react-router-dom";
import React from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { useUsuarioStore } from "../stores/useUsuarioStore";
import { useIsMobile } from "../hooks/use-mobile";

export default function AppSidebar() {
  const { currentUsuario } = useUsuarioStore();
  const isMobile = useIsMobile();

  const isAdmin = currentUsuario?.rol === 'ADMIN' || currentUsuario?.rol === 'ROLE_ADMIN';

  const adminMenuItems = [
    {
      label: "Panel de Control",
      shortLabel: "Panel",
      icon: "fas fa-home",
      to: "/admin/",
    },
    {
      label: "Créditos",
      shortLabel: "Créditos",
      icon: "fas fa-credit-card",
      to: "/admin/creditos",
    },
    {
      label: "Cobros",
      shortLabel: "Cobros",
      icon: 'fa fa-money-bill',
      to: "/admin/cobros",
    },
    {
      label: "Caja Chica",
      shortLabel: "Caja",
      icon: "fas fa-cash-register",
      to: "/admin/caja",
    },
    {
      label: "Historial",
      shortLabel: "Historial",
      icon: "fas fa-history",
      to: "/admin/historial",
    },
    {
      label: "Usuarios",
      shortLabel: "Usuarios",
      icon: "fas fa-users",
      to: "/admin/usuarios",
    },
  ];

  const userMenuItems = [
    {
      label: "Inicio",
      shortLabel: "Inicio",
      icon: "fas fa-home",
      to: "/usuario/",
    },
    {
      label: "Solicitar Crédito",
      shortLabel: "Solicitar",
      icon: "fas fa-file",
      to: "/usuario/solicitar",
    },
    {
      label: "Tus Créditos",
      shortLabel: "Créditos",
      icon: "fas fa-credit-card",
      to: "/usuario/creditos",
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  // Mobile homebar
  if (isMobile) {
    return (
      <div className="homebar">
        {menuItems.map((item) => {
          const isActive = window.location.pathname.replace(/\/$/, '') === item.to.replace(/\/$/, '');
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`btn-homebar ${isActive ? 'active' : ''}`}
            >
              <i className={item.icon} />
              <span>{item.shortLabel || item.label}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  // Desktop sidebar
  return (
    <Sidebar className="border-none">
        <SidebarHeader />
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel className="text-gray-300">Menu</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                      {menuItems.map((item) => {
                        const IconElement = <i className={item.icon} />;
                        
                        return (
                          <SidebarMenuItem key={item.to}>
                            <SidebarMenuButton asChild>
                              <Link 
                                to={item.to}
                                className={`h-10 !justify-start !text-gray-400 ${window.location.pathname.replace(/\/$/, '') === item.to.replace(/\/$/, '') ? 'bg-accent !text-white' : ''}`}>
                                {IconElement}
                                {item.label}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
    </Sidebar>
  )
}

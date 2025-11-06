import { Link } from "react-router-dom";
import React from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { useUsuarioStore } from "../stores/useUsuarioStore";

export default function AppSidebar() {
  const { currentUsuario } = useUsuarioStore();

  const isAdmin = currentUsuario?.rol === 'ADMIN' || currentUsuario?.rol === 'ROLE_ADMIN';

  const adminMenuItems = [
    {
      label: "Panel de Control",
      icon: "fas fa-home",
      to: "/admin/",
    },
    {
      label: "Créditos",
      icon: "fas fa-credit-card",
      to: "/admin/creditos",
    },
    {
      label: "Cobros",
      icon: 'fa fa-money-bill',
      to: "/admin/cobros",
    },
    {
      label: "Caja Chica",
      icon: "fas fa-cash-register",
      to: "/admin/caja",
    },
    {
      label: "Historial",
      icon: "fas fa-history",
      to: "/admin/historial",
    },
    {
      label: "Usuarios",
      icon: "fas fa-users",
      to: "/admin/usuarios",
    },
  ];

  const userMenuItems = [
    {
      label: "Inicio",
      icon: "fas fa-home",
      to: "/usuario/",
    },
    {
      label: "Solicitar Crédito",
      icon: "fas fa-file",
      to: "/usuario/solicitar",
    },
    {
      label: "Tus Créditos",
      icon: "fas fa-credit-card",
      to: "/usuario/creditos",
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

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

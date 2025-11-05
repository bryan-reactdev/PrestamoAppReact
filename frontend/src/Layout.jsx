import React from 'react'
import { SidebarProvider, SidebarTrigger, SidebarInset } from './components/ui/sidebar'
import AppSidebar from './components/AppSidebar'
import AppNavbar from './components/AppNavbar'

export default function Layout({ children }) {
  return (
    <SidebarProvider>
        <AppSidebar/>
        <SidebarInset className="min-w-0">
          <main className="bg-navbar">
            <div className="w-full flex items-center justify-between px-4 p-3 text-white bg-navbar">
              <SidebarTrigger className="p-2"/>
              
              <AppNavbar/>
            </div>
            
            <div className="w-full p-4 py-8 rounded-xl bg-muted">
              {children}
            </div>
          </main>
        </SidebarInset>
    </SidebarProvider>
  )
}

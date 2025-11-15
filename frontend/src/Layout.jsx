import React from 'react'
import { SidebarProvider, SidebarTrigger, SidebarInset } from './components/ui/sidebar'
import AppSidebar from './components/AppSidebar'
import AppNavbar from './components/AppNavbar'
import { useIsMobile } from './hooks/use-mobile'

export default function Layout({ children }) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
        <AppSidebar/>
        <SidebarInset className="min-w-0">
          <main className="bg-navbar">
            <div className="w-full mt-10 flex items-center justify-between px-4 p-3 text-white bg-navbar">
              {!isMobile && <SidebarTrigger className="p-2"/>}
              
              <AppNavbar/>
            </div>
            
            <div className='h-full w-full rounded-xl bg-cover bg-center bg-no-repeat' style={{ backgroundImage: 'url(/images/landing/hero-bg.png)' }}>
            {/* <div className='h-full w-full rounded-xl bg-cover bg-center bg-no-repeat'> */}
              <div className="h-full w-full p-4 py-8 rounded-xl">
              {/* <div className="h-full w-full p-4 py-8 rounded-xl bg-muted"> */}
                {children}
              </div>
            </div>
          </main>
        </SidebarInset>
    </SidebarProvider>
  )
}

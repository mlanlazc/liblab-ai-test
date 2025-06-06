import { Links, Meta, Scripts, ScrollRestoration } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Home, Building2 } from 'lucide-react';
import { Link, useLocation } from '@remix-run/react';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <SidebarProvider defaultOpen={true}>
          <Sidebar collapsible="icon">
            <SidebarHeader>
              <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === '/'}>
                    <Link to="/">
                      <Home />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === '/organizations'}>
                    <Link to="/organizations">
                      <Building2 />
                      <span>Organizations</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </SidebarProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

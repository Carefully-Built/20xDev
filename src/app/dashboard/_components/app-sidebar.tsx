"use client"

import { T } from "gt-next"
import { UsersRound, BriefcaseBusiness, Files, Settings, ChevronLeft, ChevronRight, LogOut, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, createContext, useContext, useEffect, useMemo, useCallback, type ReactNode } from "react"

import { cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SidebarOrgSwitcher } from "@/components/workos"
import { signOutAction } from "@/app/(auth)/actions"
import { useUser } from "@/providers"

const SIDEBAR_WIDTH = 220
const SIDEBAR_COLLAPSED_WIDTH = 56

interface SidebarContextValue {
  isCollapsed: boolean
  setIsCollapsed: (v: boolean) => void
  isMobileOpen: boolean
  setIsMobileOpen: (v: boolean) => void
  refreshOrg: () => void
}

// Context to share sidebar state with layout
export const SidebarContext = createContext<SidebarContextValue>({ 
  isCollapsed: false, 
  setIsCollapsed: () => undefined, 
  isMobileOpen: false,
  setIsMobileOpen: () => undefined,
  refreshOrg: () => undefined 
})

export function useSidebar(): SidebarContextValue {
  return useContext(SidebarContext)
}

interface NavItem {
  key: string
  label: ReactNode
  href: string
  icon: typeof UsersRound
}

const navItems: readonly NavItem[] = [
  { key: "opportunities", label: <T>Opportunities</T>, href: "/dashboard/opportunities", icon: BriefcaseBusiness },
  { key: "people", label: <T>People</T>, href: "/dashboard/people", icon: UsersRound },
  { key: "files", label: <T>Files</T>, href: "/dashboard/files", icon: Files },
] as const

const bottomNavItems: readonly NavItem[] = [
  { key: "settings", label: <T>Settings</T>, href: "/dashboard/settings", icon: Settings },
] as const

// Extracted NavLink component
interface NavLinkProps {
  readonly item: NavItem
  readonly isCollapsed: boolean
  readonly pathname: string
  readonly onNavClick: () => void
}

function NavLink({ item, isCollapsed, pathname, onNavClick }: NavLinkProps): React.ReactElement {
  const isActive = pathname === item.href
  const Icon = item.icon

  const content = (
    <Link
      href={item.href}
      onClick={onNavClick}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
        isActive 
          ? "bg-accent text-accent-foreground" 
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
        isCollapsed && "justify-center px-2"
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!isCollapsed && <span>{item.label}</span>}
    </Link>
  )

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    )
  }

  return content
}

// Extracted MobileNavLink component
interface MobileNavLinkProps {
  readonly item: NavItem
  readonly pathname: string
  readonly onNavClick: () => void
}

function MobileNavLink({ item, pathname, onNavClick }: MobileNavLinkProps): React.ReactElement {
  const isActive = pathname === item.href
  return (
    <Link
      href={item.href}
      onClick={onNavClick}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
        isActive
          ? "bg-accent text-accent-foreground" 
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      )}
    >
      <item.icon className="size-4 shrink-0" />
      <span>{item.label}</span>
    </Link>
  )
}

// Extracted SidebarContent component
interface SidebarContentProps {
  readonly isMobile?: boolean
  readonly isCollapsed: boolean
  readonly setIsCollapsed: (v: boolean) => void
  readonly setIsMobileOpen: (v: boolean) => void
  readonly pathname: string
  readonly user: { name?: string; email?: string; imageUrl?: string } | null
  readonly onSignOut: () => void
  readonly onNavClick: () => void
}

function SidebarContent({
  isMobile = false,
  isCollapsed,
  setIsCollapsed,
  setIsMobileOpen,
  pathname,
  user,
  onSignOut,
  onNavClick,
}: SidebarContentProps): React.ReactElement {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={cn(
        "flex h-12 items-center gap-2 px-2",
        isMobile && "justify-between",
        (isCollapsed && !isMobile) && "justify-center"
      )}>
        {/* When collapsed on desktop, only show the toggle button centered */}
        {isCollapsed && !isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setIsCollapsed(false)}
          >
            <ChevronRight className="size-4" />
          </Button>
        ) : (
          <>
            <Link href="/dashboard" className="flex min-w-0 flex-1 items-center gap-2 pl-3" onClick={onNavClick}>
              <Image
                src={siteConfig.logo}
                alt={siteConfig.name}
                width={88}
                height={22}
                className="h-5 w-auto shrink-0 dark:invert"
              />
            </Link>
            {isMobile ? (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="size-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onClick={() => setIsCollapsed(true)}
              >
                <ChevronLeft className="size-4" />
              </Button>
            )}
          </>
        )}
      </div>

      {/* Org Switcher */}
      <div className="px-2 pb-2">
        <SidebarOrgSwitcher collapsed={isCollapsed && !isMobile} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map((item) => (
          isMobile ? (
            <MobileNavLink
              key={item.key}
              item={item}
              pathname={pathname}
              onNavClick={onNavClick}
            />
          ) : (
            <NavLink
              key={item.key}
              item={item}
              isCollapsed={isCollapsed}
              pathname={pathname}
              onNavClick={onNavClick}
            />
          )
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-2 py-2 space-y-0.5">
        {bottomNavItems.map((item) => (
          isMobile ? (
            <MobileNavLink
              key={item.key}
              item={item}
              pathname={pathname}
              onNavClick={onNavClick}
            />
          ) : (
            <NavLink
              key={item.key}
              item={item}
              isCollapsed={isCollapsed}
              pathname={pathname}
              onNavClick={onNavClick}
            />
          )
        ))}
      </div>

      {/* User Profile */}
      <div className="border-t px-2 py-2">
        <div className={cn(
          "flex items-center gap-2.5 rounded-md p-1.5",
          (isCollapsed && !isMobile) && "justify-center"
        )}>
          <Avatar className="size-7 shrink-0">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="text-xs">
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          {(!isCollapsed || isMobile) && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate leading-tight">{user?.name ?? 'Loading...'}</p>
                <p className="text-xs text-muted-foreground truncate leading-tight">{user?.email ?? ''}</p>
              </div>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={onSignOut}>
                    <LogOut className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><T>Sign out</T></TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function AppSidebar(): React.ReactElement {
  const pathname = usePathname()
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar()
  const { user } = useUser()

  const handleSignOut = useCallback((): void => {
    void signOutAction()
  }, [])

  const handleNavClick = useCallback((): void => {
    // Close mobile drawer on navigation
    setIsMobileOpen(false)
  }, [setIsMobileOpen])

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu className="size-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="size-8">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback className="text-xs">
                  {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2">
              <Avatar className="size-8">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback className="text-xs">
                  {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name ?? 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email ?? ''}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="cursor-pointer">
                <Settings className="size-4 mr-2" />
                <T>Settings</T>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              variant="destructive"
              onClick={handleSignOut}
              className="cursor-pointer"
            >
              <LogOut className="size-4 mr-2" />
              <T>Sign out</T>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          <button 
            type="button"
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close sidebar"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-full max-w-xs border-r bg-background md:hidden">
            <SidebarContent
              isMobile
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              setIsMobileOpen={setIsMobileOpen}
              pathname={pathname}
              user={user}
              onSignOut={handleSignOut}
              onNavClick={handleNavClick}
            />
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r bg-background transition-all duration-200 ease-in-out md:flex",
        )}
        style={{ width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          setIsMobileOpen={setIsMobileOpen}
          pathname={pathname}
          user={user}
          onSignOut={handleSignOut}
          onNavClick={handleNavClick}
        />
      </aside>
    </>
  )
}

// Provider component
interface SidebarProviderProps {
  readonly children: React.ReactNode
}

export function SidebarProvider({ children }: SidebarProviderProps): React.ReactElement {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  
  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [])
  
  const refreshOrg = useCallback((): void => {
    globalThis.dispatchEvent(new CustomEvent('org-updated'))
  }, [])

  const contextValue = useMemo<SidebarContextValue>(() => ({
    isCollapsed,
    setIsCollapsed,
    isMobileOpen,
    setIsMobileOpen,
    refreshOrg,
  }), [isCollapsed, isMobileOpen, refreshOrg])
  
  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  )
}

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const SidebarContext = React.createContext<
  | {
      isOpen: boolean
      toggle: () => void
      open: () => void
      close: () => void
    }
  | undefined
>(undefined)

interface SidebarProviderProps {
  children: React.ReactNode
}

function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = React.useState(true)

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const open = React.useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, open, close }}>
      {children}
    </SidebarContext.Provider>
  )
}

function useSidebar() {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }

  return context
}

const sidebarVariants = cva(
  "fixed left-0 top-0 z-50 h-full w-full border-r bg-sidebar-background flex-col flex-shrink-0 min-h-screen overflow-hidden transition-all",
  {
    variants: {
      variant: {
        default: "w-full sm:max-w-[200px] lg:max-w-[250px] bg-white dark:bg-black", 
        compact: "w-full sm:max-w-[52px] lg:max-w-[72px] bg-white dark:bg-black",
      },
      isOpen: {
        true: "sm:translate-x-0",
        false: "-translate-x-full sm:-translate-x-full",
      },
    },
    defaultVariants: {
      variant: "default",
      isOpen: false,
    },
  }
)

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  variant?: "default" | "compact"
}

function Sidebar({
  className,
  variant = "default",
  children,
  ...props
}: SidebarProps) {
  const { isOpen } = useSidebar()

  return (
    <aside
      className={cn(sidebarVariants({ variant, isOpen }), className)}
      {...props}
    >
      {children}
    </aside>
  )
}

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { toggle, isOpen } = useSidebar()
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-14 items-center border-b px-4 bg-sidebar-background",
        className
      )}
      {...props}
    >
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 h-8 w-8 text-sidebar-foreground"
        onClick={toggle}
      >
        {isMounted && isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle Menu</span>
      </Button>
    </div>
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-1 flex-col overflow-hidden relative z-50", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center border-t bg-sidebar-background p-4",
      className
    )}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col py-2", className)}
    {...props}
  />
))
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-3 text-xs text-sidebar-foreground/50 font-medium tracking-wide", className)}
    {...props}
  />
))
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col py-1", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("list-none", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean
  }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button"
  
  return asChild ? (
    <Comp>
      <span
        ref={ref}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground",
          className
        )}
        {...props}
      />
    </Comp>
  ) : (
    <Comp
      ref={ref}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

function SidebarTrigger({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { toggle, open, isOpen } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={!isOpen ? open : toggle}
      {...props}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle Menu</span>
    </Button>
  )
}

export {
  SidebarProvider,
  useSidebar,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
}

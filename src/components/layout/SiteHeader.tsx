import { Link, linkOptions } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SettingsToggles } from "./SettingsToggles";

export const NAV = [
  { label: "Home", link: linkOptions({ to: "/" }) },
  { label: "Explore Moon", link: linkOptions({ to: "/explore/$planet", params: { planet: "moon" } }) },
  { label: "Explore Mars", link: linkOptions({ to: "/explore/$planet", params: { planet: "mars" } }) },
  { label: "Time Machine", link: linkOptions({ to: "/timeline" }) },
  { label: "Memory Archive", link: linkOptions({ to: "/archive" }) },
  { label: "Passport", link: linkOptions({ to: "/passport" }) },
  { label: "Challenges", link: linkOptions({ to: "/challenges" }) },
  { label: "About", link: linkOptions({ to: "/about" }) },
];

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("wordmark text-sm text-foreground hover:text-primary", className)} aria-label="CosmoSmriti home">
      Cosmo<span className="text-primary">smriti</span>
    </Link>
  );
}

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header className={cn("sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl", className)}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <Wordmark />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.slice(1).map((n) => (
            <Link
              key={n.label}
              {...n.link}
              className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <SettingsToggles compact />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

export function MobileNav({ triggerClassName }: { triggerClassName?: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="hud" size="icon" className={cn("lg:hidden", triggerClassName)} aria-label="Open menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 border-border bg-background">
        <SheetHeader>
          <SheetTitle className="wordmark text-left text-sm">
            Cosmo<span className="text-primary">smriti</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1 px-4" aria-label="Mobile">
          {NAV.map((n) => (
            <Link
              key={n.label}
              {...n.link}
              className="rounded-xl px-4 py-3 text-lg text-foreground hover:bg-secondary"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: n.label === "Home" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 px-8">
          <p className="eyebrow mb-3">Sound & motion</p>
          <SettingsToggles />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
        <p>
          <span className="wordmark text-xs text-foreground">CosmoSmriti</span> · The universe never forgets.
        </p>
        <p className="max-w-xl">
          An independent educational project for the NASA Space Apps Challenge. Not affiliated with or endorsed by NASA. Historical images courtesy NASA.
        </p>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-space min-h-screen">
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  );
}

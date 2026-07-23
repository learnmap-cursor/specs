import { Outlet, useLocation } from "react-router-dom"

import { AppBreadcrumb, type Crumb } from "@/components/nav/AppBreadcrumb"
import { TopNav } from "@/components/nav/TopNav"
import { getRoadmapById } from "@/data/mock"

function useBreadcrumbs(): Crumb[] {
  const location = useLocation()
  const parts = location.pathname.split("/").filter(Boolean)

  if (parts[0] === "roadmaps" && parts[1]) {
    const roadmap = getRoadmapById(parts[1])
    return [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Browse", to: "/browse" },
      { label: roadmap?.title ?? "Roadmap" },
    ]
  }

  return []
}

export function AppShell() {
  const breadcrumbs = useBreadcrumbs()

  return (
    <div className="min-h-svh bg-background">
      <TopNav />
      {breadcrumbs.length > 0 ? <AppBreadcrumb items={breadcrumbs} /> : null}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

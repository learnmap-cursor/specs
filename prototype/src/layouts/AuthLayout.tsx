import { Map } from "lucide-react"
import { Outlet } from "react-router-dom"

export function AuthLayout() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,oklch(0.92_0.05_175),transparent_55%),radial-gradient(circle_at_bottom_right,oklch(0.94_0.03_200),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,oklch(0.28_0.05_175),transparent_55%),radial-gradient(circle_at_bottom_right,oklch(0.22_0.03_200),transparent_45%)]"
      />
      <div className="relative z-10 mb-8 flex items-center gap-2 text-lg font-semibold tracking-tight">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Map className="size-5" />
        </span>
        LearnMap
      </div>
      <div className="relative z-10 w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}

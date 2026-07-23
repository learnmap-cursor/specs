import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useStore } from "@/lib/store"

export function RequireAuth() {
  const { state } = useStore()
  const location = useLocation()

  if (!state.user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export function RequireOnboarded() {
  const { state } = useStore()

  if (state.user && !state.user.onboarded) {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet />
}

export function RedirectIfAuthed() {
  const { state } = useStore()

  if (state.user?.onboarded) {
    return <Navigate to="/dashboard" replace />
  }

  if (state.user && !state.user.onboarded) {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet />
}

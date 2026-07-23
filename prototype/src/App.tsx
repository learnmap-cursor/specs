import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import {
  RedirectIfAuthed,
  RequireAuth,
  RequireOnboarded,
} from "@/components/auth/RequireAuth"
import { AppShell } from "@/layouts/AppShell"
import { AuthLayout } from "@/layouts/AuthLayout"
import { CatalogPage } from "@/pages/CatalogPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { LoginPage } from "@/pages/LoginPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { OnboardingPage } from "@/pages/OnboardingPage"
import { RoadmapViewerPage } from "@/pages/RoadmapViewerPage"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RedirectIfAuthed />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<AuthLayout />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>

          <Route element={<RequireOnboarded />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/browse" element={<CatalogPage />} />
              <Route path="/roadmaps/:id" element={<RoadmapViewerPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

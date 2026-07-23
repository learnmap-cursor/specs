import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { StoreProvider } from "@/lib/store"
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="learnmap-theme">
      <StoreProvider>
        <App />
        <Toaster richColors position="top-center" />
      </StoreProvider>
    </ThemeProvider>
  </StrictMode>
)

import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useStore } from "@/lib/store"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="currentColor"
        d="M21.6 12.23c0-.68-.06-1.33-.17-1.96H12v3.71h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.89-1.74 2.98-4.3 2.98-7.27Z"
      />
      <path
        fill="currentColor"
        d="M12 22c2.7 0 4.96-.9 6.62-2.44l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.58A10 10 0 0 0 12 22Z"
        opacity=".8"
      />
      <path
        fill="currentColor"
        d="M6.41 13.9A6 6 0 0 1 6.1 12c0-.66.11-1.3.3-1.9V7.52H3.07A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.48l3.34-2.58Z"
        opacity=".6"
      />
      <path
        fill="currentColor"
        d="M12 5.98c1.47 0 2.79.5 3.82 1.5l2.86-2.86A9.96 9.96 0 0 0 12 2 10 10 0 0 0 3.07 7.52l3.34 2.58C7.2 7.74 9.4 5.98 12 5.98Z"
        opacity=".9"
      />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.48A10.27 10.27 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  )
}

export function LoginPage() {
  const { signIn, state } = useStore()
  const navigate = useNavigate()

  function handleSignIn(provider: "google" | "github") {
    const returning = Boolean(state.lastProfile?.onboarded || state.user?.onboarded)
    signIn(provider)
    navigate(returning ? "/dashboard" : "/onboarding", { replace: true })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in to LearnMap</CardTitle>
        <CardDescription>
          Continue with Google or GitHub. No email/password — this prototype mocks OAuth.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button
          size="lg"
          className="w-full justify-center"
          onClick={() => handleSignIn("google")}
        >
          <GoogleIcon />
          Continue with Google
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full justify-center"
          onClick={() => handleSignIn("github")}
        >
          <GitHubIcon />
          Continue with GitHub
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Tip: after onboarding once, sign out and sign in again to land on the dashboard.
        </p>
      </CardContent>
    </Card>
  )
}

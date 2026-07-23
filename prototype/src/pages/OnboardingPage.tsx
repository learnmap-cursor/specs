import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store"

export function OnboardingPage() {
  const { state, completeOnboarding } = useStore()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState(state.user?.displayName ?? "")

  if (!state.user) {
    return <Navigate to="/login" replace />
  }

  if (state.user.onboarded) {
    return <Navigate to="/dashboard" replace />
  }

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "LM"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to LearnMap</CardTitle>
        <CardDescription>
          Confirm your display name and profile photo to finish setup.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <Avatar size="lg">
            <AvatarImage
              src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(displayName || "Alex Rivera")}`}
              alt={displayName}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="text-sm text-muted-foreground">
            Photo is generated from your display name for this prototype.
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="displayName">Display name</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Your name"
            autoFocus
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          disabled={!displayName.trim()}
          onClick={() => {
            completeOnboarding(displayName)
            navigate("/dashboard", { replace: true })
          }}
        >
          Continue to dashboard
        </Button>
      </CardFooter>
    </Card>
  )
}

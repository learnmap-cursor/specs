import { useState } from "react"
import { Link } from "react-router-dom"
import { CheckCircle2, Compass, Layers } from "lucide-react"
import { toast } from "sonner"

import { RoadmapCard } from "@/components/roadmap/RoadmapCard"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ROADMAPS, type Roadmap } from "@/data/mock"
import { useStore } from "@/lib/store"

function formatRelativeTime(iso: string) {
  const delta = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(delta / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function DashboardPage() {
  const { state, getProgressForRoadmap, resetProgress } = useStore()
  const [resetTarget, setResetTarget] = useState<Roadmap | null>(null)

  const enrolledRoadmaps = ROADMAPS.filter((roadmap) =>
    state.enrolments.some((item) => item.roadmapId === roadmap.id)
  )

  const totalTopicsCompleted = enrolledRoadmaps.reduce(
    (sum, roadmap) => sum + getProgressForRoadmap(roadmap.id).done,
    0
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick up where you left off across your enrolled roadmaps.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/browse">
            <Compass />
            Browse roadmaps
          </Link>
        </Button>
      </div>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Layers className="size-4" />
            Roadmaps enrolled
          </div>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {enrolledRoadmaps.length}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4" />
            Topics completed
          </div>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {totalTopicsCompleted}
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Your roadmaps</h2>
        {enrolledRoadmaps.length === 0 ? (
          <div className="rounded-xl border border-dashed px-6 py-10 text-center">
            <p className="font-medium">No enrolments yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse the catalog and enrol in a roadmap to track progress here.
            </p>
            <Button asChild className="mt-4">
              <Link to="/browse">Browse roadmaps</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {enrolledRoadmaps.map((roadmap) => (
              <RoadmapCard
                key={roadmap.id}
                roadmap={roadmap}
                variant="dashboard"
                onReset={() => setResetTarget(roadmap)}
              />
            ))}
          </div>
        )}
      </section>

      {state.recentlyCompleted.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-medium">Recently completed</h2>
          <ul className="divide-y rounded-xl border">
            {state.recentlyCompleted.map((item) => (
              <li
                key={`${item.roadmapId}-${item.topicId}-${item.completedAt}`}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{item.topicTitle}</p>
                  <p className="text-xs text-muted-foreground">{item.roadmapTitle}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(item.completedAt)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Dialog open={Boolean(resetTarget)} onOpenChange={(open) => !open && setResetTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset progress?</DialogTitle>
            <DialogDescription>
              This clears all topic statuses for {resetTarget?.title}. You stay enrolled.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                if (!resetTarget) return
                resetProgress(resetTarget.id)
                toast.success(`Progress reset for ${resetTarget.title}`)
                setResetTarget(null)
              }}
            >
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

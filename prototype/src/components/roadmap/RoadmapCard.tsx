import { Link } from "react-router-dom"
import { BookOpen, Bookmark, BookmarkCheck, RotateCcw } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { countTopics, type Roadmap } from "@/data/mock"
import { useStore } from "@/lib/store"

type RoadmapCardProps = {
  roadmap: Roadmap
  variant: "catalog" | "dashboard"
  onEnrol?: () => void
  onUnenrol?: () => void
  onReset?: () => void
}

export function RoadmapCard({
  roadmap,
  variant,
  onEnrol,
  onUnenrol,
  onReset,
}: RoadmapCardProps) {
  const { isEnrolled, getProgressForRoadmap, state, getMergedRoadmap } = useStore()
  const enrolled = isEnrolled(roadmap.id)
  const progress = getProgressForRoadmap(roadmap.id)
  const enrolment = state.enrolments.find((item) => item.roadmapId === roadmap.id)
  const merged = getMergedRoadmap(roadmap.id) ?? roadmap
  const topicCount = countTopics(merged.topics)
  const continueTo = enrolment?.lastTopicId
    ? `/roadmaps/${roadmap.id}?topic=${enrolment.lastTopicId}`
    : `/roadmaps/${roadmap.id}`

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base">
            <Link
              to={`/roadmaps/${roadmap.id}`}
              className="transition-colors hover:text-primary"
            >
              {roadmap.title}
            </Link>
          </CardTitle>
          <div className="flex items-center gap-1">
            {enrolled ? <Badge variant="secondary">In progress</Badge> : null}
            {variant === "catalog" ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label={enrolled ? "Unenrol from roadmap" : "Enrol in roadmap"}
                aria-pressed={enrolled}
                onClick={enrolled ? onUnenrol : onEnrol}
              >
                {enrolled ? (
                  <BookmarkCheck className="size-4 text-primary" />
                ) : (
                  <Bookmark className="size-4" />
                )}
              </Button>
            ) : null}
          </div>
        </div>
        <CardDescription>{roadmap.description}</CardDescription>
        <div className="flex flex-wrap gap-1.5">
          {roadmap.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="size-4" />
          {topicCount} topics
          {merged.topics.length > topicCount
            ? ` · ${merged.topics.length - topicCount} subtopics`
            : null}
        </div>
        {variant === "dashboard" ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress.percent}%</span>
            </div>
            <Progress value={progress.percent} />
            <p className="text-xs text-muted-foreground">
              {progress.done} done · {progress.inProgress} learning ·{" "}
              {progress.skipped} skipped · {progress.notStarted} not started
            </p>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {variant === "dashboard" ? (
          <>
            <Button asChild className="flex-1">
              <Link to={continueTo}>Continue</Link>
            </Button>
            <Button variant="outline" size="icon" aria-label="Reset progress" onClick={onReset}>
              <RotateCcw />
            </Button>
          </>
        ) : (
          <Button asChild className="flex-1" variant="outline">
            <Link to={`/roadmaps/${roadmap.id}`}>
              {enrolled ? "Open" : "Browse"}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

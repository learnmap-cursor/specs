import { useEffect, useMemo, useState } from "react"
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { toast } from "sonner"

import { RoadmapViewer } from "@/components/roadmap/RoadmapViewer"
import { TopicDetailPanel } from "@/components/roadmap/TopicDetailPanel"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { TopicStatus } from "@/data/mock"
import { getTopicStatus, STATUS_LABELS, useStore } from "@/lib/store"

export function RoadmapViewerPage() {
  const { id = "" } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    state,
    isEnrolled,
    enrol,
    unenrol,
    getMergedRoadmap,
    getProgressForRoadmap,
    setTopicStatus,
    setLastTopic,
    addSubtopic,
  } = useStore()

  const roadmap = getMergedRoadmap(id)

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(
    searchParams.get("topic")
  )

  useEffect(() => {
    const fromQuery = searchParams.get("topic")
    if (fromQuery) {
      setSelectedTopicId(fromQuery)
    }
  }, [searchParams])

  const selectedTopic = useMemo(
    () => roadmap?.topics.find((topic) => topic.id === selectedTopicId) ?? null,
    [roadmap, selectedTopicId]
  )

  if (!roadmap) {
    return <Navigate to="/404" replace />
  }

  const activeRoadmap = roadmap
  const enrolled = isEnrolled(activeRoadmap.id)
  const progress = getProgressForRoadmap(activeRoadmap.id)
  const selectedStatus: TopicStatus = selectedTopic
    ? getTopicStatus(state.progress, activeRoadmap.id, selectedTopic.id)
    : "not_started"

  function handleSelectTopic(topicId: string) {
    setSelectedTopicId(topicId)
    if (isEnrolled(activeRoadmap.id)) {
      setLastTopic(activeRoadmap.id, topicId)
    }
    setSearchParams({ topic: topicId }, { replace: true })
  }

  function handleToggleEnrol() {
    if (isEnrolled(activeRoadmap.id)) {
      unenrol(activeRoadmap.id)
      toast.message(`Removed bookmark for ${activeRoadmap.title}`)
      return
    }
    enrol(activeRoadmap.id)
    toast.success(`Bookmarked ${activeRoadmap.title}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {activeRoadmap.title}
            </h1>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={enrolled ? "Remove bookmark" : "Bookmark roadmap"}
              aria-pressed={enrolled}
              onClick={handleToggleEnrol}
            >
              {enrolled ? (
                <BookmarkCheck className="size-4 text-primary" />
              ) : (
                <Bookmark className="size-4" />
              )}
            </Button>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {activeRoadmap.description}
          </p>
          {!enrolled ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Browsing without enrolment — bookmark to track progress.
            </p>
          ) : null}
        </div>
        <Button asChild variant="outline">
          <Link to="/browse">Back to browse</Link>
        </Button>
      </div>

      {enrolled ? (
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall completion</span>
            <span className="font-medium">{progress.percent}%</span>
          </div>
          <Progress value={progress.percent} />
          <p className="mt-2 text-xs text-muted-foreground">
            {progress.done} done · {progress.inProgress} learning · {progress.skipped}{" "}
            skipped · {progress.notStarted} not started
          </p>
        </div>
      ) : null}

      <RoadmapViewer
        roadmap={activeRoadmap}
        progress={state.progress}
        selectedTopicId={selectedTopicId}
        onSelectTopic={handleSelectTopic}
      />

      <TopicDetailPanel
        topic={selectedTopic}
        status={selectedStatus}
        enrolled={enrolled}
        open={Boolean(selectedTopic)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTopicId(null)
            setSearchParams({}, { replace: true })
          }
        }}
        onStatusChange={(status) => {
          if (!selectedTopic) return
          if (!isEnrolled(activeRoadmap.id)) {
            toast.message("Bookmark this roadmap to track status")
            return
          }
          setTopicStatus(activeRoadmap.id, selectedTopic.id, status)
          toast.success(`${selectedTopic.title}: ${STATUS_LABELS[status]}`)
        }}
        onAddSubtopic={
          selectedTopic?.kind === "topic"
            ? (title) => {
                const created = addSubtopic(
                  activeRoadmap.id,
                  selectedTopic.id,
                  title
                )
                if (created) {
                  toast.success(`Added subtopic “${created.title}”`)
                  setSelectedTopicId(created.id)
                  setSearchParams({ topic: created.id }, { replace: true })
                }
              }
            : undefined
        }
      />
    </div>
  )
}

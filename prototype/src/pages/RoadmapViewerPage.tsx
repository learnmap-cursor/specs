import { useEffect, useMemo, useState } from "react"
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

import { RoadmapViewer } from "@/components/roadmap/RoadmapViewer"
import { TopicDetailPanel } from "@/components/roadmap/TopicDetailPanel"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getRoadmapById, type TopicStatus } from "@/data/mock"
import { getTopicStatus, STATUS_LABELS, useStore } from "@/lib/store"

export function RoadmapViewerPage() {
  const { id = "" } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const roadmap = getRoadmapById(id)
  const {
    state,
    isEnrolled,
    enrol,
    getProgressForRoadmap,
    setTopicStatus,
    setLastTopic,
  } = useStore()

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(
    searchParams.get("topic")
  )

  useEffect(() => {
    if (!roadmap) return
    if (!isEnrolled(roadmap.id)) {
      enrol(roadmap.id)
      toast.message(`Enrolled in ${roadmap.title} to open the viewer`)
    }
  }, [roadmap, isEnrolled, enrol])

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

  const progress = getProgressForRoadmap(roadmap.id)
  const selectedStatus: TopicStatus = selectedTopic
    ? getTopicStatus(state.progress, roadmap.id, selectedTopic.id)
    : "not_started"

  function handleSelectTopic(topicId: string) {
    setSelectedTopicId(topicId)
    setLastTopic(roadmap!.id, topicId)
    setSearchParams({ topic: topicId }, { replace: true })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{roadmap.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {roadmap.description}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Overall completion</span>
          <span className="font-medium">{progress.percent}%</span>
        </div>
        <Progress value={progress.percent} />
        <p className="mt-2 text-xs text-muted-foreground">
          {progress.done} done · {progress.inProgress} in progress · {progress.skipped}{" "}
          skipped · {progress.notStarted} not started
        </p>
      </div>

      <RoadmapViewer
        roadmap={roadmap}
        progress={state.progress}
        selectedTopicId={selectedTopicId}
        onSelectTopic={handleSelectTopic}
      />

      <TopicDetailPanel
        topic={selectedTopic}
        status={selectedStatus}
        open={Boolean(selectedTopic)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTopicId(null)
            setSearchParams({}, { replace: true })
          }
        }}
        onStatusChange={(status) => {
          if (!selectedTopic) return
          setTopicStatus(roadmap.id, selectedTopic.id, status)
          toast.success(`${selectedTopic.title}: ${STATUS_LABELS[status]}`)
        }}
      />
    </div>
  )
}

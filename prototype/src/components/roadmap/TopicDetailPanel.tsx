import { useState } from "react"
import { ExternalLink, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Topic, TopicStatus } from "@/data/mock"
import { STATUS_LABELS } from "@/lib/store"

type TopicDetailPanelProps = {
  topic: Topic | null
  status: TopicStatus
  open: boolean
  enrolled: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (status: TopicStatus) => void
  onAddSubtopic?: (title: string) => void
}

export function TopicDetailPanel({
  topic,
  status,
  open,
  enrolled,
  onOpenChange,
  onStatusChange,
  onAddSubtopic,
}: TopicDetailPanelProps) {
  const [subtopicTitle, setSubtopicTitle] = useState("")

  function handleAddSubtopic() {
    if (!onAddSubtopic || !subtopicTitle.trim()) return
    onAddSubtopic(subtopicTitle.trim())
    setSubtopicTitle("")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        {topic ? (
          <>
            <SheetHeader>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {topic.kind === "subtopic" ? "Subtopic" : "Topic"}
                {topic.section ? ` · ${topic.section}` : null}
              </p>
              <SheetTitle>{topic.title}</SheetTitle>
              <SheetDescription>{topic.description}</SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6 px-4">
              <div className="space-y-2">
                <Label htmlFor="topic-status">Status</Label>
                {enrolled ? (
                  <Select
                    value={status}
                    onValueChange={(value) => onStatusChange(value as TopicStatus)}
                  >
                    <SelectTrigger id="topic-status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(STATUS_LABELS) as TopicStatus[]).map((value) => (
                        <SelectItem key={value} value={value}>
                          {STATUS_LABELS[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                    Bookmark this roadmap to track status on topics.
                  </p>
                )}
              </div>

              {topic.kind === "topic" && onAddSubtopic ? (
                <div className="space-y-2">
                  <Label htmlFor="add-subtopic">Add subtopic</Label>
                  <div className="flex gap-2">
                    <Input
                      id="add-subtopic"
                      value={subtopicTitle}
                      onChange={(event) => setSubtopicTitle(event.target.value)}
                      placeholder="Subtopic title"
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault()
                          handleAddSubtopic()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label="Add subtopic"
                      onClick={handleAddSubtopic}
                      disabled={!subtopicTitle.trim()}
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Resources</h3>
                {topic.resources.length > 0 ? (
                  <ul className="space-y-2">
                    {topic.resources.map((resource) => (
                      <li key={resource.id}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-start gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                        >
                          <ExternalLink className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                          <span className="min-w-0 flex-1">
                            <span className="font-medium">{resource.title}</span>
                            <span className="mt-1 block">
                              <Badge variant="outline" className="font-normal capitalize">
                                {resource.type}
                              </Badge>
                            </span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No resources yet.</p>
                )}
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

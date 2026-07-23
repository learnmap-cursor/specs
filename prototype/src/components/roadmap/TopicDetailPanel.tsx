import { ExternalLink } from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
  onOpenChange: (open: boolean) => void
  onStatusChange: (status: TopicStatus) => void
}

export function TopicDetailPanel({
  topic,
  status,
  open,
  onOpenChange,
  onStatusChange,
}: TopicDetailPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        {topic ? (
          <>
            <SheetHeader>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {topic.section}
              </p>
              <SheetTitle>{topic.title}</SheetTitle>
              <SheetDescription>{topic.description}</SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6 px-4">
              <div className="space-y-2">
                <Label htmlFor="topic-status">Status</Label>
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
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Resources</h3>
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
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

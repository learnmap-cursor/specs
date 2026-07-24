import { Handle, Position, type Node, type NodeProps } from "@xyflow/react"

import type { TopicStatus } from "@/data/mock"
import { STATUS_LABELS } from "@/lib/store"
import { cn } from "@/lib/utils"

export type TopicNodeData = {
  title: string
  section: string
  status: TopicStatus
}

export type TopicFlowNode = Node<TopicNodeData, "topic">

const statusClass: Record<TopicStatus, string> = {
  not_started: "border-status-not-started bg-status-not-started/20",
  in_progress: "border-status-in-progress bg-status-in-progress/20",
  done: "border-status-done bg-status-done/20",
  skipped: "border-status-skipped bg-status-skipped/20",
}

const statusDot: Record<TopicStatus, string> = {
  not_started: "bg-status-not-started",
  in_progress: "bg-status-in-progress",
  done: "bg-status-done",
  skipped: "bg-status-skipped",
}

export function TopicNode({ data, selected }: NodeProps<TopicFlowNode>) {
  return (
    <div
      className={cn(
        "min-w-44 rounded-lg border-2 bg-card px-3 py-2 shadow-none transition-colors",
        statusClass[data.status],
        selected && "ring-2 ring-ring"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />
      <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
        {data.section}
      </p>
      <p className="mt-0.5 text-sm font-medium">{data.title}</p>
      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span className={cn("size-2 rounded-full", statusDot[data.status])} />
        {STATUS_LABELS[data.status]}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
    </div>
  )
}

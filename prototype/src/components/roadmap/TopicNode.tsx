import { Handle, Position, type Node, type NodeProps } from "@xyflow/react"

import type { TopicKind, TopicStatus } from "@/data/mock"
import type { NodeSide } from "@/lib/layout-roadmap"
import { cn } from "@/lib/utils"

export type TopicNodeData = {
  title: string
  kind: TopicKind
  status: TopicStatus
  side?: NodeSide
}

export type TopicFlowNode = Node<TopicNodeData, "topic">

export function TopicNode({ data, selected }: NodeProps<TopicFlowNode>) {
  const isTopic = data.kind === "topic"
  const isDone = data.status === "done"
  const isSkipped = data.status === "skipped"
  const isLearning = data.status === "in_progress"

  return (
    <div
      className={cn(
        "min-w-36 max-w-48 rounded-md border-2 px-3 py-2 transition-colors",
        isTopic
          ? "border-node-topic bg-node-topic/20"
          : "border-node-subtopic bg-node-subtopic/20",
        isLearning && "border-status-in-progress bg-status-in-progress/35",
        isSkipped && "border-muted-foreground/30 bg-muted text-muted-foreground",
        selected && "ring-2 ring-ring"
      )}
    >
      {isTopic ? (
        <>
          <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />
          <Handle
            type="source"
            position={Position.Bottom}
            id="spine"
            className="!bg-muted-foreground"
          />
          <Handle
            type="source"
            position={Position.Left}
            id="left"
            className="!bg-muted-foreground"
          />
          <Handle
            type="source"
            position={Position.Right}
            id="right"
            className="!bg-muted-foreground"
          />
        </>
      ) : (
        <Handle
          type="target"
          position={data.side === "left" ? Position.Right : Position.Left}
          className="!bg-muted-foreground"
        />
      )}

      <p
        className={cn(
          "text-sm font-medium leading-snug",
          isTopic ? "text-foreground" : "text-foreground/90",
          (isDone || isSkipped) && "line-through decoration-2"
        )}
      >
        {data.title}
      </p>
    </div>
  )
}

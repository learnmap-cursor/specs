import { useEffect, useMemo } from "react"
import {
  Background,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type NodeTypes,
} from "@xyflow/react"

import { TopicNode, type TopicFlowNode } from "@/components/roadmap/TopicNode"
import { buildRoadmapEdges, type Roadmap, type TopicStatus } from "@/data/mock"
import { layoutRoadmapNodes } from "@/lib/layout-roadmap"
import { getTopicStatus } from "@/lib/store"

const nodeTypes = {
  topic: TopicNode,
} satisfies NodeTypes

type RoadmapViewerProps = {
  roadmap: Roadmap
  progress: Record<string, TopicStatus>
  selectedTopicId: string | null
  onSelectTopic: (topicId: string) => void
}

export function RoadmapViewer({
  roadmap,
  progress,
  selectedTopicId,
  onSelectTopic,
}: RoadmapViewerProps) {
  const layout = useMemo(
    () => layoutRoadmapNodes(roadmap.topics),
    [roadmap.topics]
  )

  const layoutById = useMemo(() => {
    return new Map(layout.map((item) => [item.id, item]))
  }, [layout])

  const initialNodes = useMemo<TopicFlowNode[]>(
    () =>
      roadmap.topics.map((topic) => {
        const placed = layoutById.get(topic.id)
        return {
          id: topic.id,
          type: "topic",
          position: { x: placed?.x ?? 0, y: placed?.y ?? 0 },
          data: {
            title: topic.title,
            kind: topic.kind,
            status: getTopicStatus(progress, roadmap.id, topic.id),
            side: placed?.side,
          },
          selected: topic.id === selectedTopicId,
        }
      }),
    [roadmap, progress, selectedTopicId, layoutById]
  )

  const initialEdges = useMemo<Edge[]>(() => {
    const topicIds = new Set(
      roadmap.topics.filter((topic) => topic.kind === "topic").map((topic) => topic.id)
    )

    return buildRoadmapEdges(roadmap.topics).map((edge) => {
      const isSpine = topicIds.has(edge.source) && topicIds.has(edge.target)
      const sourceSide = layoutById.get(edge.target)?.side

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: "smoothstep",
        animated: false,
        style: { stroke: "var(--border)" },
        ...(isSpine
          ? { sourceHandle: "spine" }
          : {
              sourceHandle: sourceSide === "left" ? "left" : "right",
            }),
      }
    })
  }, [roadmap.topics, layoutById])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    setNodes(initialNodes)
  }, [initialNodes, setNodes])

  useEffect(() => {
    setEdges(initialEdges)
  }, [initialEdges, setEdges])

  return (
    <div className="h-[min(80vh,800px)] overflow-hidden rounded-xl border bg-muted/20">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        panOnDrag
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling
        onNodeClick={(_, node) => onSelectTopic(node.id)}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ type: "smoothstep" }}
      >
        <Background gap={18} size={1} />
      </ReactFlow>
    </div>
  )
}

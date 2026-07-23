import { useEffect, useMemo } from "react"
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type NodeTypes,
} from "@xyflow/react"

import { TopicNode, type TopicFlowNode } from "@/components/roadmap/TopicNode"
import type { Roadmap, TopicStatus } from "@/data/mock"
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
  const initialNodes = useMemo<TopicFlowNode[]>(
    () =>
      roadmap.topics.map((topic) => ({
        id: topic.id,
        type: "topic",
        position: topic.position,
        data: {
          title: topic.title,
          section: topic.section,
          status: getTopicStatus(progress, roadmap.id, topic.id),
        },
        selected: topic.id === selectedTopicId,
      })),
    [roadmap, progress, selectedTopicId]
  )

  const initialEdges = useMemo<Edge[]>(
    () =>
      roadmap.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: false,
        style: { stroke: "var(--border)" },
      })),
    [roadmap.edges]
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    setNodes(initialNodes)
  }, [initialNodes, setNodes])

  useEffect(() => {
    setEdges(initialEdges)
  }, [initialEdges, setEdges])

  return (
    <div className="h-[min(70vh,640px)] overflow-hidden rounded-xl border bg-muted/20">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        onNodeClick={(_, node) => onSelectTopic(node.id)}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={18} size={1} />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          nodeStrokeWidth={2}
          className="!bg-card !border"
        />
      </ReactFlow>
    </div>
  )
}

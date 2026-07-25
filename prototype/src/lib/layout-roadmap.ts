import {
  getRootTopics,
  getSubtopics,
  type Topic,
} from "@/data/mock"

export type NodeSide = "left" | "right"

export type LaidOutNode = {
  id: string
  x: number
  y: number
  side?: NodeSide
}

const CENTER_X = 320
const TOPIC_Y_GAP = 128
const SUB_X_OFFSET = 220
const SUB_Y_GAP = 56

/**
 * Stack root topics vertically. Place each topic's subtopics on the side
 * with more free space (fewer subtopics already placed on that side).
 */
export function layoutRoadmapNodes(topics: Topic[]): LaidOutNode[] {
  const roots = getRootTopics(topics)
  const laidOut: LaidOutNode[] = []
  let y = 40
  let leftLoad = 0
  let rightLoad = 0

  for (const root of roots) {
    const children = getSubtopics(topics, root.id)
    const side: NodeSide = leftLoad <= rightLoad ? "left" : "right"

    laidOut.push({ id: root.id, x: CENTER_X, y })

    if (children.length > 0) {
      const stackHeight = (children.length - 1) * SUB_Y_GAP
      const startY = y - stackHeight / 2
      const childX =
        side === "right" ? CENTER_X + SUB_X_OFFSET : CENTER_X - SUB_X_OFFSET

      children.forEach((child, index) => {
        laidOut.push({
          id: child.id,
          x: childX,
          y: startY + index * SUB_Y_GAP,
          side,
        })
      })

      if (side === "left") leftLoad += children.length
      else rightLoad += children.length

      y += Math.max(TOPIC_Y_GAP, stackHeight + 96)
    } else {
      y += TOPIC_Y_GAP
    }
  }

  return laidOut
}

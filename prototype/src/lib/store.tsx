/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

import { ROADMAPS, type TopicStatus } from "@/data/mock"

const STORAGE_KEY = "learnmap-prototype-state"

export type User = {
  id: string
  email: string
  displayName: string
  avatarUrl: string
  provider: "google" | "github"
  onboarded: boolean
}

export type Enrolment = {
  roadmapId: string
  enrolledAt: string
  lastTopicId: string | null
}

export type CompletedTopic = {
  roadmapId: string
  topicId: string
  topicTitle: string
  roadmapTitle: string
  completedAt: string
}

export type AppState = {
  user: User | null
  /** Remembers the last onboarded profile so mock OAuth can skip onboarding on return. */
  lastProfile: User | null
  enrolments: Enrolment[]
  progress: Record<string, TopicStatus>
  recentlyCompleted: CompletedTopic[]
}

type StoreContextValue = {
  state: AppState
  signIn: (provider: "google" | "github") => void
  completeOnboarding: (displayName: string) => void
  signOut: () => void
  enrol: (roadmapId: string) => void
  unenrol: (roadmapId: string) => void
  setTopicStatus: (roadmapId: string, topicId: string, status: TopicStatus) => void
  setLastTopic: (roadmapId: string, topicId: string) => void
  resetProgress: (roadmapId: string) => void
  isEnrolled: (roadmapId: string) => boolean
  getProgressForRoadmap: (roadmapId: string) => {
    done: number
    inProgress: number
    skipped: number
    notStarted: number
    total: number
    percent: number
  }
}

const defaultState: AppState = {
  user: null,
  lastProfile: null,
  enrolments: [],
  progress: {},
  recentlyCompleted: [],
}

function progressKey(roadmapId: string, topicId: string) {
  return `${roadmapId}:${topicId}`
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw) as AppState
    return {
      ...defaultState,
      ...parsed,
      lastProfile: parsed.lastProfile ?? parsed.user ?? null,
      enrolments: parsed.enrolments ?? [],
      progress: parsed.progress ?? {},
      recentlyCompleted: parsed.recentlyCompleted ?? [],
    }
  } catch {
    return defaultState
  }
}

const StoreContext = React.createContext<StoreContextValue | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AppState>(() => loadState())

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const signIn = React.useCallback((provider: "google" | "github") => {
    setState((prev) => {
      if (prev.user) {
        return {
          ...prev,
          user: { ...prev.user, provider },
        }
      }

      if (prev.lastProfile?.onboarded) {
        return {
          ...prev,
          user: { ...prev.lastProfile, provider },
        }
      }

      const name = "Alex Rivera"
      const email =
        provider === "google" ? "alex@gmail.com" : "alex@users.noreply.github.com"

      return {
        ...prev,
        user: {
          id: "user-demo",
          email,
          displayName: name,
          avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
          provider,
          onboarded: false,
        },
      }
    })
  }, [])

  const completeOnboarding = React.useCallback((displayName: string) => {
    setState((prev) => {
      if (!prev.user) return prev
      const user = {
        ...prev.user,
        displayName: displayName.trim() || prev.user.displayName,
        avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(displayName.trim() || prev.user.displayName)}`,
        onboarded: true,
      }
      return {
        ...prev,
        user,
        lastProfile: user,
      }
    })
  }, [])

  const signOut = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      lastProfile: prev.user?.onboarded ? prev.user : prev.lastProfile,
      user: null,
    }))
  }, [])

  const enrol = React.useCallback((roadmapId: string) => {
    setState((prev) => {
      if (prev.enrolments.some((item) => item.roadmapId === roadmapId)) {
        return prev
      }
      const roadmap = ROADMAPS.find((item) => item.id === roadmapId)
      return {
        ...prev,
        enrolments: [
          ...prev.enrolments,
          {
            roadmapId,
            enrolledAt: new Date().toISOString(),
            lastTopicId: roadmap?.topics[0]?.id ?? null,
          },
        ],
      }
    })
  }, [])

  const unenrol = React.useCallback((roadmapId: string) => {
    setState((prev) => ({
      ...prev,
      enrolments: prev.enrolments.filter((item) => item.roadmapId !== roadmapId),
    }))
  }, [])

  const setTopicStatus = React.useCallback(
    (roadmapId: string, topicId: string, status: TopicStatus) => {
      setState((prev) => {
        const key = progressKey(roadmapId, topicId)
        const roadmap = ROADMAPS.find((item) => item.id === roadmapId)
        const topic = roadmap?.topics.find((item) => item.id === topicId)
        let recentlyCompleted = prev.recentlyCompleted

        if (status === "done" && topic && roadmap) {
          recentlyCompleted = [
            {
              roadmapId,
              topicId,
              topicTitle: topic.title,
              roadmapTitle: roadmap.title,
              completedAt: new Date().toISOString(),
            },
            ...prev.recentlyCompleted.filter(
              (item) => !(item.roadmapId === roadmapId && item.topicId === topicId)
            ),
          ].slice(0, 5)
        } else {
          recentlyCompleted = prev.recentlyCompleted.filter(
            (item) => !(item.roadmapId === roadmapId && item.topicId === topicId)
          )
        }

        const enrolments = prev.enrolments.map((item) =>
          item.roadmapId === roadmapId ? { ...item, lastTopicId: topicId } : item
        )

        return {
          ...prev,
          progress: { ...prev.progress, [key]: status },
          recentlyCompleted,
          enrolments,
        }
      })
    },
    []
  )

  const setLastTopic = React.useCallback((roadmapId: string, topicId: string) => {
    setState((prev) => ({
      ...prev,
      enrolments: prev.enrolments.map((item) =>
        item.roadmapId === roadmapId ? { ...item, lastTopicId: topicId } : item
      ),
    }))
  }, [])

  const resetProgress = React.useCallback((roadmapId: string) => {
    setState((prev) => {
      const nextProgress = { ...prev.progress }
      for (const key of Object.keys(nextProgress)) {
        if (key.startsWith(`${roadmapId}:`)) {
          delete nextProgress[key]
        }
      }
      return {
        ...prev,
        progress: nextProgress,
        recentlyCompleted: prev.recentlyCompleted.filter(
          (item) => item.roadmapId !== roadmapId
        ),
        enrolments: prev.enrolments.map((item) =>
          item.roadmapId === roadmapId ? { ...item, lastTopicId: null } : item
        ),
      }
    })
  }, [])

  const isEnrolled = React.useCallback(
    (roadmapId: string) => state.enrolments.some((item) => item.roadmapId === roadmapId),
    [state.enrolments]
  )

  const getProgressForRoadmap = React.useCallback(
    (roadmapId: string) => {
      const roadmap = ROADMAPS.find((item) => item.id === roadmapId)
      const total = roadmap?.topics.length ?? 0
      let done = 0
      let inProgress = 0
      let skipped = 0
      let notStarted = 0

      for (const topic of roadmap?.topics ?? []) {
        const status = state.progress[progressKey(roadmapId, topic.id)] ?? "not_started"
        if (status === "done") done += 1
        else if (status === "in_progress") inProgress += 1
        else if (status === "skipped") skipped += 1
        else notStarted += 1
      }

      const percent = total === 0 ? 0 : Math.round((done / total) * 100)
      return { done, inProgress, skipped, notStarted, total, percent }
    },
    [state.progress]
  )

  const value = React.useMemo(
    () => ({
      state,
      signIn,
      completeOnboarding,
      signOut,
      enrol,
      unenrol,
      setTopicStatus,
      setLastTopic,
      resetProgress,
      isEnrolled,
      getProgressForRoadmap,
    }),
    [
      state,
      signIn,
      completeOnboarding,
      signOut,
      enrol,
      unenrol,
      setTopicStatus,
      setLastTopic,
      resetProgress,
      isEnrolled,
      getProgressForRoadmap,
    ]
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = React.useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within StoreProvider")
  }
  return context
}

export function getTopicStatus(
  progress: Record<string, TopicStatus>,
  roadmapId: string,
  topicId: string
): TopicStatus {
  return progress[progressKey(roadmapId, topicId)] ?? "not_started"
}

export const STATUS_LABELS: Record<TopicStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  done: "Done",
  skipped: "Skipped",
}

import { useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { toast } from "sonner"

import { RoadmapCard } from "@/components/roadmap/RoadmapCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ALL_TAGS, ROADMAPS, type Roadmap } from "@/data/mock"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function CatalogPage() {
  const { enrol, unenrol } = useStore()
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [unenrolTarget, setUnenrolTarget] = useState<Roadmap | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 300)
    return () => window.clearTimeout(timer)
  }, [query])

  const filtered = useMemo(() => {
    return ROADMAPS.filter((roadmap) => {
      const matchesQuery =
        !debouncedQuery ||
        roadmap.title.toLowerCase().includes(debouncedQuery) ||
        roadmap.description.toLowerCase().includes(debouncedQuery) ||
        roadmap.tags.some((tag) => tag.includes(debouncedQuery))

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => roadmap.tags.includes(tag))

      return matchesQuery && matchesTags
    })
  }, [debouncedQuery, selectedTags])

  function toggleTag(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Browse roadmaps</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search and filter the library, then enrol to track progress on your dashboard.
        </p>
      </div>

      <div className="space-y-3">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or keyword"
            className="pl-8"
            aria-label="Search roadmaps"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((tag) => {
            const active = selectedTags.includes(tag)
            return (
              <button key={tag} type="button" onClick={() => toggleTag(tag)}>
                <Badge
                  variant={active ? "default" : "outline"}
                  className={cn("cursor-pointer font-normal", active && "hover:bg-primary/90")}
                >
                  {tag}
                </Badge>
              </button>
            )
          })}
          {selectedTags.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])}>
              Clear filters
            </Button>
          ) : null}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {ROADMAPS.length} roadmaps
      </p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((roadmap) => (
          <RoadmapCard
            key={roadmap.id}
            roadmap={roadmap}
            variant="catalog"
            onEnrol={() => {
              enrol(roadmap.id)
              toast.success(`Enrolled in ${roadmap.title}`)
            }}
            onUnenrol={() => setUnenrolTarget(roadmap)}
          />
        ))}
      </div>

      <Dialog
        open={Boolean(unenrolTarget)}
        onOpenChange={(open) => !open && setUnenrolTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unenrol from {unenrolTarget?.title}?</DialogTitle>
            <DialogDescription>
              You will leave this roadmap. Progress is preserved and restored if you re-enrol.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                if (!unenrolTarget) return
                unenrol(unenrolTarget.id)
                toast.message(`Unenrolled from ${unenrolTarget.title}`)
                setUnenrolTarget(null)
              }}
            >
              Unenrol
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

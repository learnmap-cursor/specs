export type TopicStatus = "not_started" | "in_progress" | "done" | "skipped"

export type TopicKind = "topic" | "subtopic"

export type ResourceType = "article" | "video" | "course"

export type Resource = {
  id: string
  title: string
  url: string
  type: ResourceType
}

export type Topic = {
  id: string
  title: string
  description: string
  section: string
  kind: TopicKind
  parentId?: string
  resources: Resource[]
}

export type TopicEdge = {
  id: string
  source: string
  target: string
}

export type Roadmap = {
  id: string
  slug: string
  title: string
  description: string
  tags: string[]
  isSeeded: boolean
  topics: Topic[]
}

export const ALL_TAGS = [
  "frontend",
  "backend",
  "devops",
  "react",
  "python",
  "javascript",
  "typescript",
] as const

function topic(
  partial: Omit<Topic, "kind" | "resources"> & { resources?: Resource[] }
): Topic {
  return {
    ...partial,
    kind: "topic",
    resources: partial.resources ?? [],
  }
}

function subtopic(
  partial: Omit<Topic, "kind" | "resources"> & {
    parentId: string
    resources?: Resource[]
  }
): Topic {
  return {
    ...partial,
    kind: "subtopic",
    resources: partial.resources ?? [],
  }
}

export const ROADMAPS: Roadmap[] = [
  {
    id: "rm-frontend",
    slug: "frontend",
    title: "Frontend Developer",
    description:
      "HTML, CSS, JavaScript, and modern UI frameworks on the path to shipping polished web apps.",
    tags: ["frontend", "javascript", "typescript"],
    isSeeded: true,
    topics: [
      topic({
        id: "fe-internet",
        title: "Internet",
        description: "How the web works: DNS, HTTP, browsers, and hosting basics.",
        section: "Foundations",
        resources: [
          {
            id: "fe-internet-1",
            title: "How does the Internet work?",
            url: "https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work",
            type: "article",
          },
        ],
      }),
      subtopic({
        id: "fe-internet-dns",
        parentId: "fe-internet",
        title: "DNS & HTTP",
        description: "Name resolution and request/response basics.",
        section: "Foundations",
      }),
      subtopic({
        id: "fe-internet-browsers",
        parentId: "fe-internet",
        title: "Browsers",
        description: "Rendering engines and the browser as a platform.",
        section: "Foundations",
      }),
      topic({
        id: "fe-html",
        title: "HTML",
        description: "Semantic markup, forms, accessibility attributes, and document structure.",
        section: "Foundations",
        resources: [
          {
            id: "fe-html-1",
            title: "HTML basics — MDN",
            url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics",
            type: "article",
          },
        ],
      }),
      subtopic({
        id: "fe-html-semantic",
        parentId: "fe-html",
        title: "Semantic markup",
        description: "Meaningful elements and document outline.",
        section: "Foundations",
      }),
      subtopic({
        id: "fe-html-forms",
        parentId: "fe-html",
        title: "Forms",
        description: "Inputs, validation attributes, and accessible labels.",
        section: "Foundations",
      }),
      topic({
        id: "fe-css",
        title: "CSS",
        description: "Layout, flexbox, grid, responsive design, and modern styling techniques.",
        section: "Foundations",
        resources: [
          {
            id: "fe-css-1",
            title: "Learn CSS — web.dev",
            url: "https://web.dev/learn/css/",
            type: "course",
          },
        ],
      }),
      subtopic({
        id: "fe-css-layout",
        parentId: "fe-css",
        title: "Flexbox & Grid",
        description: "Modern layout systems.",
        section: "Foundations",
      }),
      subtopic({
        id: "fe-css-responsive",
        parentId: "fe-css",
        title: "Responsive design",
        description: "Breakpoints, fluid type, and mobile-first patterns.",
        section: "Foundations",
      }),
      topic({
        id: "fe-js",
        title: "JavaScript",
        description: "Language fundamentals, DOM APIs, async patterns, and modules.",
        section: "Foundations",
        resources: [
          {
            id: "fe-js-1",
            title: "JavaScript.info",
            url: "https://javascript.info/",
            type: "course",
          },
        ],
      }),
      subtopic({
        id: "fe-ts",
        parentId: "fe-js",
        title: "TypeScript",
        description: "Types, interfaces, generics, and tooling for safer frontend code.",
        section: "Tooling",
        resources: [
          {
            id: "fe-ts-1",
            title: "TypeScript Handbook",
            url: "https://www.typescriptlang.org/docs/handbook/intro.html",
            type: "article",
          },
        ],
      }),
      subtopic({
        id: "fe-vcs",
        parentId: "fe-js",
        title: "Git & GitHub",
        description: "Version control workflows, branching, and collaboration on GitHub.",
        section: "Tooling",
        resources: [
          {
            id: "fe-vcs-1",
            title: "Git handbook",
            url: "https://docs.github.com/en/get-started/using-git/about-git",
            type: "article",
          },
        ],
      }),
      topic({
        id: "fe-framework",
        title: "Pick a Framework",
        description: "Compare React, Vue, and Svelte — choose one and go deep.",
        section: "Frameworks",
        resources: [
          {
            id: "fe-framework-1",
            title: "React docs",
            url: "https://react.dev/learn",
            type: "course",
          },
        ],
      }),
      subtopic({
        id: "fe-framework-react",
        parentId: "fe-framework",
        title: "React",
        description: "Component model and ecosystem overview.",
        section: "Frameworks",
      }),
      subtopic({
        id: "fe-framework-vue",
        parentId: "fe-framework",
        title: "Vue",
        description: "Template syntax and reactivity basics.",
        section: "Frameworks",
      }),
      topic({
        id: "fe-testing",
        title: "Testing",
        description: "Unit, integration, and end-to-end testing for UI code.",
        section: "Frameworks",
        resources: [
          {
            id: "fe-testing-1",
            title: "Testing Library docs",
            url: "https://testing-library.com/docs/",
            type: "article",
          },
        ],
      }),
      topic({
        id: "fe-a11y",
        title: "Accessibility",
        description: "WCAG basics, keyboard navigation, ARIA, and inclusive UX.",
        section: "Quality",
        resources: [
          {
            id: "fe-a11y-1",
            title: "a11y project checklist",
            url: "https://www.a11yproject.com/checklist/",
            type: "article",
          },
        ],
      }),
      subtopic({
        id: "fe-a11y-aria",
        parentId: "fe-a11y",
        title: "ARIA patterns",
        description: "Roles, states, and common widget patterns.",
        section: "Quality",
      }),
    ],
  },
  {
    id: "rm-react",
    slug: "react",
    title: "React",
    description:
      "Components, hooks, routing, and data fetching for building React applications.",
    tags: ["frontend", "react", "javascript", "typescript"],
    isSeeded: true,
    topics: [
      topic({
        id: "re-basics",
        title: "React Basics",
        description: "JSX, components, props, and rendering mental models.",
        section: "Core",
        resources: [
          {
            id: "re-basics-1",
            title: "Describing the UI",
            url: "https://react.dev/learn/describing-the-ui",
            type: "article",
          },
        ],
      }),
      subtopic({
        id: "re-basics-jsx",
        parentId: "re-basics",
        title: "JSX & components",
        description: "Composition and props.",
        section: "Core",
      }),
      topic({
        id: "re-hooks",
        title: "Hooks",
        description: "useState, useEffect, custom hooks, and rules of hooks.",
        section: "Core",
        resources: [
          {
            id: "re-hooks-1",
            title: "Built-in React Hooks",
            url: "https://react.dev/reference/react/hooks",
            type: "article",
          },
        ],
      }),
      subtopic({
        id: "re-router",
        parentId: "re-hooks",
        title: "React Router",
        description: "Client-side routing, nested layouts, and loaders.",
        section: "App structure",
        resources: [
          {
            id: "re-router-1",
            title: "React Router tutorial",
            url: "https://reactrouter.com/en/main/start/tutorial",
            type: "course",
          },
        ],
      }),
      subtopic({
        id: "re-state",
        parentId: "re-hooks",
        title: "State Management",
        description: "Local vs shared state, context, and server-state libraries.",
        section: "App structure",
        resources: [
          {
            id: "re-state-1",
            title: "TanStack Query overview",
            url: "https://tanstack.com/query/latest/docs/framework/react/overview",
            type: "article",
          },
        ],
      }),
      subtopic({
        id: "re-forms",
        parentId: "re-hooks",
        title: "Forms",
        description: "Controlled inputs, validation, and accessible form patterns.",
        section: "UI",
        resources: [
          {
            id: "re-forms-1",
            title: "React forms guide",
            url: "https://react.dev/reference/react-dom/components/form",
            type: "article",
          },
        ],
      }),
      topic({
        id: "re-perf",
        title: "Performance",
        description: "Memoization pitfalls, concurrent features, and profiling.",
        section: "UI",
        resources: [
          {
            id: "re-perf-1",
            title: "React performance",
            url: "https://react.dev/learn/render-and-commit",
            type: "article",
          },
        ],
      }),
      topic({
        id: "re-testing",
        title: "Testing React",
        description: "Component tests with Testing Library and user-centric assertions.",
        section: "Quality",
        resources: [
          {
            id: "re-testing-1",
            title: "Testing React apps",
            url: "https://testing-library.com/docs/react-testing-library/intro/",
            type: "article",
          },
        ],
      }),
      subtopic({
        id: "re-testing-rtl",
        parentId: "re-testing",
        title: "Testing Library",
        description: "Queries and user-event patterns.",
        section: "Quality",
      }),
      topic({
        id: "re-next",
        title: "Next steps",
        description: "SSR frameworks, design systems, and production checklist.",
        section: "Quality",
        resources: [
          {
            id: "re-next-1",
            title: "React learning paths",
            url: "https://react.dev/learn",
            type: "course",
          },
        ],
      }),
    ],
  },
  {
    id: "rm-devops",
    slug: "devops",
    title: "DevOps",
    description:
      "Linux, containers, CI/CD, and cloud fundamentals for shipping and operating software.",
    tags: ["devops", "backend", "python"],
    isSeeded: true,
    topics: [
      topic({
        id: "do-linux",
        title: "Linux Basics",
        description: "Shell, processes, permissions, and package management.",
        section: "Foundations",
        resources: [
          {
            id: "do-linux-1",
            title: "Linux journey",
            url: "https://linuxjourney.com/",
            type: "course",
          },
        ],
      }),
      subtopic({
        id: "do-networking",
        parentId: "do-linux",
        title: "Networking",
        description: "TCP/IP, DNS, load balancing, and TLS essentials.",
        section: "Foundations",
        resources: [
          {
            id: "do-networking-1",
            title: "Networking fundamentals",
            url: "https://www.cloudflare.com/learning/network-layer/how-does-the-internet-work/",
            type: "article",
          },
        ],
      }),
      subtopic({
        id: "do-containers",
        parentId: "do-linux",
        title: "Containers",
        description: "Docker images, volumes, networking, and compose.",
        section: "Runtime",
        resources: [
          {
            id: "do-containers-1",
            title: "Docker getting started",
            url: "https://docs.docker.com/get-started/",
            type: "course",
          },
        ],
      }),
      topic({
        id: "do-k8s",
        title: "Kubernetes",
        description: "Pods, deployments, services, and cluster mental models.",
        section: "Runtime",
        resources: [
          {
            id: "do-k8s-1",
            title: "Kubernetes basics",
            url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
            type: "course",
          },
        ],
      }),
      subtopic({
        id: "do-ci",
        parentId: "do-k8s",
        title: "CI/CD",
        description: "Pipelines, artifacts, environments, and progressive delivery.",
        section: "Delivery",
        resources: [
          {
            id: "do-ci-1",
            title: "GitHub Actions docs",
            url: "https://docs.github.com/en/actions",
            type: "article",
          },
        ],
      }),
      subtopic({
        id: "do-iac",
        parentId: "do-k8s",
        title: "Infrastructure as Code",
        description: "Declarative infra with Terraform or similar tools.",
        section: "Delivery",
        resources: [
          {
            id: "do-iac-1",
            title: "Terraform tutorials",
            url: "https://developer.hashicorp.com/terraform/tutorials",
            type: "course",
          },
        ],
      }),
      topic({
        id: "do-observability",
        title: "Observability",
        description: "Logs, metrics, traces, and alerting that help you sleep.",
        section: "Operations",
        resources: [
          {
            id: "do-observability-1",
            title: "OpenTelemetry overview",
            url: "https://opentelemetry.io/docs/concepts/what-is-opentelemetry/",
            type: "article",
          },
        ],
      }),
      subtopic({
        id: "do-observability-metrics",
        parentId: "do-observability",
        title: "Metrics & logs",
        description: "Signal types and when to use each.",
        section: "Operations",
      }),
      topic({
        id: "do-cloud",
        title: "Cloud Fundamentals",
        description: "Compute, storage, networking, and IAM on a major cloud.",
        section: "Operations",
        resources: [
          {
            id: "do-cloud-1",
            title: "AWS Cloud Essentials",
            url: "https://aws.amazon.com/getting-started/cloud-essentials/",
            type: "course",
          },
        ],
      }),
    ],
  },
]

export function getRoadmapById(id: string): Roadmap | undefined {
  return ROADMAPS.find((roadmap) => roadmap.id === id || roadmap.slug === id)
}

export function getTopicById(roadmapId: string, topicId: string): Topic | undefined {
  return getRoadmapById(roadmapId)?.topics.find((topic) => topic.id === topicId)
}

export function getRootTopics(topics: Topic[]): Topic[] {
  return topics.filter((topic) => topic.kind === "topic")
}

export function getSubtopics(topics: Topic[], parentId: string): Topic[] {
  return topics.filter(
    (topic) => topic.kind === "subtopic" && topic.parentId === parentId
  )
}

/** Topic spine edges + parent→subtopic edges. */
export function buildRoadmapEdges(topics: Topic[]): TopicEdge[] {
  const roots = getRootTopics(topics)
  const edges: TopicEdge[] = []

  for (let index = 0; index < roots.length - 1; index += 1) {
    const source = roots[index]
    const target = roots[index + 1]
    edges.push({
      id: `e-${source.id}-${target.id}`,
      source: source.id,
      target: target.id,
    })
  }

  for (const item of topics) {
    if (item.kind === "subtopic" && item.parentId) {
      edges.push({
        id: `e-${item.parentId}-${item.id}`,
        source: item.parentId,
        target: item.id,
      })
    }
  }

  return edges
}

export function countTopics(topics: Topic[]): number {
  return getRootTopics(topics).length
}

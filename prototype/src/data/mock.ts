export type TopicStatus = "not_started" | "in_progress" | "done" | "skipped"

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
  position: { x: number; y: number }
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
  edges: TopicEdge[]
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
      {
        id: "fe-internet",
        title: "Internet",
        description: "How the web works: DNS, HTTP, browsers, and hosting basics.",
        section: "Foundations",
        position: { x: 160, y: 0 },
        resources: [
          {
            id: "fe-internet-1",
            title: "How does the Internet work?",
            url: "https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work",
            type: "article",
          },
        ],
      },
      {
        id: "fe-html",
        title: "HTML",
        description: "Semantic markup, forms, accessibility attributes, and document structure.",
        section: "Foundations",
        position: { x: 160, y: 120 },
        resources: [
          {
            id: "fe-html-1",
            title: "HTML basics — MDN",
            url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics",
            type: "article",
          },
        ],
      },
      {
        id: "fe-css",
        title: "CSS",
        description: "Layout, flexbox, grid, responsive design, and modern styling techniques.",
        section: "Foundations",
        position: { x: 160, y: 240 },
        resources: [
          {
            id: "fe-css-1",
            title: "Learn CSS — web.dev",
            url: "https://web.dev/learn/css/",
            type: "course",
          },
        ],
      },
      {
        id: "fe-js",
        title: "JavaScript",
        description: "Language fundamentals, DOM APIs, async patterns, and modules.",
        section: "Foundations",
        position: { x: 160, y: 360 },
        resources: [
          {
            id: "fe-js-1",
            title: "JavaScript.info",
            url: "https://javascript.info/",
            type: "course",
          },
        ],
      },
      {
        id: "fe-ts",
        title: "TypeScript",
        description: "Types, interfaces, generics, and tooling for safer frontend code.",
        section: "Tooling",
        position: { x: 0, y: 480 },
        resources: [
          {
            id: "fe-ts-1",
            title: "TypeScript Handbook",
            url: "https://www.typescriptlang.org/docs/handbook/intro.html",
            type: "article",
          },
        ],
      },
      {
        id: "fe-vcs",
        title: "Git & GitHub",
        description: "Version control workflows, branching, and collaboration on GitHub.",
        section: "Tooling",
        position: { x: 320, y: 480 },
        resources: [
          {
            id: "fe-vcs-1",
            title: "Git handbook",
            url: "https://docs.github.com/en/get-started/using-git/about-git",
            type: "article",
          },
        ],
      },
      {
        id: "fe-framework",
        title: "Pick a Framework",
        description: "Compare React, Vue, and Svelte — choose one and go deep.",
        section: "Frameworks",
        position: { x: 160, y: 600 },
        resources: [
          {
            id: "fe-framework-1",
            title: "React docs",
            url: "https://react.dev/learn",
            type: "course",
          },
        ],
      },
      {
        id: "fe-testing",
        title: "Testing",
        description: "Unit, integration, and end-to-end testing for UI code.",
        section: "Frameworks",
        position: { x: 160, y: 720 },
        resources: [
          {
            id: "fe-testing-1",
            title: "Testing Library docs",
            url: "https://testing-library.com/docs/",
            type: "article",
          },
        ],
      },
      {
        id: "fe-a11y",
        title: "Accessibility",
        description: "WCAG basics, keyboard navigation, ARIA, and inclusive UX.",
        section: "Quality",
        position: { x: 160, y: 840 },
        resources: [
          {
            id: "fe-a11y-1",
            title: "a11y project checklist",
            url: "https://www.a11yproject.com/checklist/",
            type: "article",
          },
        ],
      },
    ],
    edges: [
      { id: "e-fe-1", source: "fe-internet", target: "fe-html" },
      { id: "e-fe-2", source: "fe-html", target: "fe-css" },
      { id: "e-fe-3", source: "fe-css", target: "fe-js" },
      { id: "e-fe-4", source: "fe-js", target: "fe-ts" },
      { id: "e-fe-5", source: "fe-js", target: "fe-vcs" },
      { id: "e-fe-6", source: "fe-ts", target: "fe-framework" },
      { id: "e-fe-7", source: "fe-vcs", target: "fe-framework" },
      { id: "e-fe-8", source: "fe-framework", target: "fe-testing" },
      { id: "e-fe-9", source: "fe-testing", target: "fe-a11y" },
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
      {
        id: "re-basics",
        title: "React Basics",
        description: "JSX, components, props, and rendering mental models.",
        section: "Core",
        position: { x: 160, y: 0 },
        resources: [
          {
            id: "re-basics-1",
            title: "Describing the UI",
            url: "https://react.dev/learn/describing-the-ui",
            type: "article",
          },
        ],
      },
      {
        id: "re-hooks",
        title: "Hooks",
        description: "useState, useEffect, custom hooks, and rules of hooks.",
        section: "Core",
        position: { x: 160, y: 120 },
        resources: [
          {
            id: "re-hooks-1",
            title: "Built-in React Hooks",
            url: "https://react.dev/reference/react/hooks",
            type: "article",
          },
        ],
      },
      {
        id: "re-router",
        title: "React Router",
        description: "Client-side routing, nested layouts, and loaders.",
        section: "App structure",
        position: { x: 0, y: 240 },
        resources: [
          {
            id: "re-router-1",
            title: "React Router tutorial",
            url: "https://reactrouter.com/en/main/start/tutorial",
            type: "course",
          },
        ],
      },
      {
        id: "re-state",
        title: "State Management",
        description: "Local vs shared state, context, and server-state libraries.",
        section: "App structure",
        position: { x: 160, y: 240 },
        resources: [
          {
            id: "re-state-1",
            title: "TanStack Query overview",
            url: "https://tanstack.com/query/latest/docs/framework/react/overview",
            type: "article",
          },
        ],
      },
      {
        id: "re-forms",
        title: "Forms",
        description: "Controlled inputs, validation, and accessible form patterns.",
        section: "UI",
        position: { x: 320, y: 240 },
        resources: [
          {
            id: "re-forms-1",
            title: "React forms guide",
            url: "https://react.dev/reference/react-dom/components/form",
            type: "article",
          },
        ],
      },
      {
        id: "re-perf",
        title: "Performance",
        description: "Memoization pitfalls, concurrent features, and profiling.",
        section: "UI",
        position: { x: 160, y: 360 },
        resources: [
          {
            id: "re-perf-1",
            title: "React performance",
            url: "https://react.dev/learn/render-and-commit",
            type: "article",
          },
        ],
      },
      {
        id: "re-testing",
        title: "Testing React",
        description: "Component tests with Testing Library and user-centric assertions.",
        section: "Quality",
        position: { x: 160, y: 480 },
        resources: [
          {
            id: "re-testing-1",
            title: "Testing React apps",
            url: "https://testing-library.com/docs/react-testing-library/intro/",
            type: "article",
          },
        ],
      },
      {
        id: "re-next",
        title: "Next steps",
        description: "SSR frameworks, design systems, and production checklist.",
        section: "Quality",
        position: { x: 160, y: 600 },
        resources: [
          {
            id: "re-next-1",
            title: "React learning paths",
            url: "https://react.dev/learn",
            type: "course",
          },
        ],
      },
    ],
    edges: [
      { id: "e-re-1", source: "re-basics", target: "re-hooks" },
      { id: "e-re-2", source: "re-hooks", target: "re-router" },
      { id: "e-re-3", source: "re-hooks", target: "re-state" },
      { id: "e-re-4", source: "re-hooks", target: "re-forms" },
      { id: "e-re-5", source: "re-state", target: "re-perf" },
      { id: "e-re-6", source: "re-forms", target: "re-testing" },
      { id: "e-re-7", source: "re-perf", target: "re-testing" },
      { id: "e-re-8", source: "re-testing", target: "re-next" },
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
      {
        id: "do-linux",
        title: "Linux Basics",
        description: "Shell, processes, permissions, and package management.",
        section: "Foundations",
        position: { x: 160, y: 0 },
        resources: [
          {
            id: "do-linux-1",
            title: "Linux journey",
            url: "https://linuxjourney.com/",
            type: "course",
          },
        ],
      },
      {
        id: "do-networking",
        title: "Networking",
        description: "TCP/IP, DNS, load balancing, and TLS essentials.",
        section: "Foundations",
        position: { x: 0, y: 120 },
        resources: [
          {
            id: "do-networking-1",
            title: "Networking fundamentals",
            url: "https://www.cloudflare.com/learning/network-layer/how-does-the-internet-work/",
            type: "article",
          },
        ],
      },
      {
        id: "do-containers",
        title: "Containers",
        description: "Docker images, volumes, networking, and compose.",
        section: "Runtime",
        position: { x: 320, y: 120 },
        resources: [
          {
            id: "do-containers-1",
            title: "Docker getting started",
            url: "https://docs.docker.com/get-started/",
            type: "course",
          },
        ],
      },
      {
        id: "do-k8s",
        title: "Kubernetes",
        description: "Pods, deployments, services, and cluster mental models.",
        section: "Runtime",
        position: { x: 160, y: 240 },
        resources: [
          {
            id: "do-k8s-1",
            title: "Kubernetes basics",
            url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
            type: "course",
          },
        ],
      },
      {
        id: "do-ci",
        title: "CI/CD",
        description: "Pipelines, artifacts, environments, and progressive delivery.",
        section: "Delivery",
        position: { x: 0, y: 360 },
        resources: [
          {
            id: "do-ci-1",
            title: "GitHub Actions docs",
            url: "https://docs.github.com/en/actions",
            type: "article",
          },
        ],
      },
      {
        id: "do-iac",
        title: "Infrastructure as Code",
        description: "Declarative infra with Terraform or similar tools.",
        section: "Delivery",
        position: { x: 320, y: 360 },
        resources: [
          {
            id: "do-iac-1",
            title: "Terraform tutorials",
            url: "https://developer.hashicorp.com/terraform/tutorials",
            type: "course",
          },
        ],
      },
      {
        id: "do-observability",
        title: "Observability",
        description: "Logs, metrics, traces, and alerting that help you sleep.",
        section: "Operations",
        position: { x: 160, y: 480 },
        resources: [
          {
            id: "do-observability-1",
            title: "OpenTelemetry overview",
            url: "https://opentelemetry.io/docs/concepts/what-is-opentelemetry/",
            type: "article",
          },
        ],
      },
      {
        id: "do-cloud",
        title: "Cloud Fundamentals",
        description: "Compute, storage, networking, and IAM on a major cloud.",
        section: "Operations",
        position: { x: 160, y: 600 },
        resources: [
          {
            id: "do-cloud-1",
            title: "AWS Cloud Essentials",
            url: "https://aws.amazon.com/getting-started/cloud-essentials/",
            type: "course",
          },
        ],
      },
    ],
    edges: [
      { id: "e-do-1", source: "do-linux", target: "do-networking" },
      { id: "e-do-2", source: "do-linux", target: "do-containers" },
      { id: "e-do-3", source: "do-networking", target: "do-k8s" },
      { id: "e-do-4", source: "do-containers", target: "do-k8s" },
      { id: "e-do-5", source: "do-k8s", target: "do-ci" },
      { id: "e-do-6", source: "do-k8s", target: "do-iac" },
      { id: "e-do-7", source: "do-ci", target: "do-observability" },
      { id: "e-do-8", source: "do-iac", target: "do-observability" },
      { id: "e-do-9", source: "do-observability", target: "do-cloud" },
    ],
  },
]

export function getRoadmapById(id: string): Roadmap | undefined {
  return ROADMAPS.find((roadmap) => roadmap.id === id || roadmap.slug === id)
}

export function getTopicById(roadmapId: string, topicId: string): Topic | undefined {
  return getRoadmapById(roadmapId)?.topics.find((topic) => topic.id === topicId)
}

# Implementation order (Backlog)

Stories are filed as issues in this repo. Implement in this order (INVEST-sized; each depends on prior foundation where noted).

## 0. Foundation — [#4](https://github.com/learnmap-cursor/specs/issues/4)

| # | Story |
|---|---|
| [#11](https://github.com/learnmap-cursor/specs/issues/11) | Scaffold learnmap/api |
| [#12](https://github.com/learnmap-cursor/specs/issues/12) | Scaffold learnmap/app |
| [#13](https://github.com/learnmap-cursor/specs/issues/13) | Docker Compose (Postgres) |
| [#14](https://github.com/learnmap-cursor/specs/issues/14) | Initial Prisma schema |
| [#15](https://github.com/learnmap-cursor/specs/issues/15) | CI — api |
| [#16](https://github.com/learnmap-cursor/specs/issues/16) | CI — app |

## 1. App shell — [#5](https://github.com/learnmap-cursor/specs/issues/5) (EP-000)

| # | Story |
|---|---|
| [#17](https://github.com/learnmap-cursor/specs/issues/17) | AppShell + top nav |
| [#18](https://github.com/learnmap-cursor/specs/issues/18) | UserMenu |
| [#19](https://github.com/learnmap-cursor/specs/issues/19) | Breadcrumb |
| [#20](https://github.com/learnmap-cursor/specs/issues/20) | Mobile nav |
| [#21](https://github.com/learnmap-cursor/specs/issues/21) | Route guards + 404 |

## 2. Authentication — [#6](https://github.com/learnmap-cursor/specs/issues/6) (EP-001)

| # | Story |
|---|---|
| [#22](https://github.com/learnmap-cursor/specs/issues/22) | OAuth endpoints (Arctic) |
| [#23](https://github.com/learnmap-cursor/specs/issues/23) | JWT httpOnly cookie + guard |
| [#24](https://github.com/learnmap-cursor/specs/issues/24) | User find-or-create |
| [#25](https://github.com/learnmap-cursor/specs/issues/25) | Login page |
| [#26](https://github.com/learnmap-cursor/specs/issues/26) | Onboarding page |
| [#27](https://github.com/learnmap-cursor/specs/issues/27) | Auth callback + expiry |

## 3. Catalog — [#7](https://github.com/learnmap-cursor/specs/issues/7) (EP-002)

| # | Story |
|---|---|
| [#28](https://github.com/learnmap-cursor/specs/issues/28) | Seed roadmap.sh data |
| [#29](https://github.com/learnmap-cursor/specs/issues/29) | Catalog list/search/tags API |
| [#30](https://github.com/learnmap-cursor/specs/issues/30) | Enrolment API |
| [#31](https://github.com/learnmap-cursor/specs/issues/31) | Catalog page (prototype) |
| [#32](https://github.com/learnmap-cursor/specs/issues/32) | Enrol / unenrol UI |

## 4. Viewer — [#8](https://github.com/learnmap-cursor/specs/issues/8) (EP-003)

| # | Story |
|---|---|
| [#33](https://github.com/learnmap-cursor/specs/issues/33) | Roadmap detail API |
| [#34](https://github.com/learnmap-cursor/specs/issues/34) | Progress API |
| [#35](https://github.com/learnmap-cursor/specs/issues/35) | React Flow viewer |
| [#36](https://github.com/learnmap-cursor/specs/issues/36) | Topic detail panel |
| [#37](https://github.com/learnmap-cursor/specs/issues/37) | Status controls + progress bar |
| [#38](https://github.com/learnmap-cursor/specs/issues/38) | Admin resource editing |

## 5. Progress dashboard — [#9](https://github.com/learnmap-cursor/specs/issues/9) (EP-004)

| # | Story |
|---|---|
| [#39](https://github.com/learnmap-cursor/specs/issues/39) | Dashboard summary API |
| [#40](https://github.com/learnmap-cursor/specs/issues/40) | Dashboard page |
| [#41](https://github.com/learnmap-cursor/specs/issues/41) | Recently completed |
| [#42](https://github.com/learnmap-cursor/specs/issues/42) | Reset progress |

## 6. Custom builder — [#10](https://github.com/learnmap-cursor/specs/issues/10) (EP-005)

| # | Story |
|---|---|
| [#43](https://github.com/learnmap-cursor/specs/issues/43) | Roadmap CRUD API |
| [#44](https://github.com/learnmap-cursor/specs/issues/44) | Topic/edge/section CRUD |
| [#45](https://github.com/learnmap-cursor/specs/issues/45) | Duplicate + from-text API |
| [#46](https://github.com/learnmap-cursor/specs/issues/46) | Builder canvas |
| [#47](https://github.com/learnmap-cursor/specs/issues/47) | Metadata form |
| [#48](https://github.com/learnmap-cursor/specs/issues/48) | Resource editor |
| [#49](https://github.com/learnmap-cursor/specs/issues/49) | Text import editor |
| [#50](https://github.com/learnmap-cursor/specs/issues/50) | Publish / unpublish |

Machine-readable definitions: [`stories.json`](stories.json).

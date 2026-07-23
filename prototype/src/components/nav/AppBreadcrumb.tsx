import { Fragment } from "react"
import { Link } from "react-router-dom"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export type Crumb = {
  label: string
  to?: string
}

export function AppBreadcrumb({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null

  return (
    <div className="border-b bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-2.5">
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((item, index) => {
              const isLast = index === items.length - 1
              return (
                <Fragment key={`${item.label}-${index}`}>
                  <BreadcrumbItem>
                    {isLast || !item.to ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={item.to}>{item.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast ? <BreadcrumbSeparator /> : null}
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
}

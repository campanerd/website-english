"use client"

import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import type { LevelWithTopics } from "@/lib/queries/levels"

export function NavbarClient({ levels }: { levels: LevelWithTopics[] }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Metodologia</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-72 gap-1 p-1">
              {levels.map((level) => (
                <li key={level.id}>
                  <NavigationMenuLink render={<Link href={`/metodologia/${level.slug}`} />}>
                    {level.title}
                  </NavigationMenuLink>
                  {level.topics.length > 0 && (
                    <ul className="ml-3 border-l pl-3">
                      {level.topics.map(
                        (topic) =>
                          topic.pdfUrl && (
                            <li key={topic.id}>
                              <NavigationMenuLink
                                render={
                                  <a
                                    href={topic.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  />
                                }
                                className="text-muted-foreground"
                              >
                                {topic.title}
                              </NavigationMenuLink>
                            </li>
                          )
                      )}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink render={<Link href="/contato" />}>
            Contato
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

import Link from "next/link"
import { getPublishedLevelsWithTopics } from "@/lib/queries/levels"
import { NavbarClient } from "@/components/layout/NavbarClient"

export async function Navbar() {
  const levels = await getPublishedLevelsWithTopics()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-heading text-lg font-semibold text-primary"
        >
          Aulas de Inglês
        </Link>
        <NavbarClient levels={levels} />
      </div>
    </header>
  )
}

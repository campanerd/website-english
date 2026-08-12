import Link from "next/link"
import { getPublishedLevelsWithTopics } from "@/lib/queries/levels"

export default async function MetodologiaPage() {
  const levels = await getPublishedLevelsWithTopics()

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading text-3xl font-bold text-primary">
        Minha Metodologia
      </h1>
      <p className="mt-2 text-muted-foreground">
        Material de estudo gratuito, organizado por nível.
      </p>

      {levels.length === 0 ? (
        <p className="mt-10 text-muted-foreground">
          Em breve, novos níveis por aqui.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {levels.map((level) => (
            <li key={level.id}>
              <Link
                href={`/metodologia/${level.slug}`}
                className="block rounded-xl border p-5 hover:border-primary hover:bg-muted"
              >
                <h2 className="font-heading text-lg font-semibold">
                  {level.title}
                </h2>
                {level.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {level.description}
                  </p>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                  {level.topics.length}{" "}
                  {level.topics.length === 1 ? "tópico" : "tópicos"} disponíveis
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

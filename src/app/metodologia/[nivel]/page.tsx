import { notFound } from "next/navigation"
import { getPublishedLevelBySlug } from "@/lib/queries/levels"

export default async function LevelPage(props: PageProps<"/metodologia/[nivel]">) {
  const { nivel } = await props.params
  const level = await getPublishedLevelBySlug(nivel)

  if (!level) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading text-3xl font-bold text-primary">
        {level.title}
      </h1>
      {level.description && (
        <p className="mt-2 text-muted-foreground">{level.description}</p>
      )}

      {level.topics.length === 0 ? (
        <p className="mt-10 text-muted-foreground">
          Em breve, novo material por aqui.
        </p>
      ) : (
        <ul className="mt-8 divide-y">
          {level.topics.map(
            (topic) =>
              topic.pdfUrl && (
                <li key={topic.id} className="py-4">
                  <a
                    href={topic.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-heading text-lg font-medium text-primary hover:underline"
                  >
                    {topic.title}
                  </a>
                  {topic.summary && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {topic.summary}
                    </p>
                  )}
                </li>
              )
          )}
        </ul>
      )}
    </div>
  )
}

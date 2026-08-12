import Image from "next/image"
import Link from "next/link"
import { getAboutContent } from "@/lib/queries/content"

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export default async function HomePage() {
  const about = await getAboutContent()
  const name = about?.name ?? "Professor de Inglês"

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="flex items-center gap-6">
        {about?.photoUrl ? (
          <Image
            src={about.photoUrl}
            alt={name}
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-2xl font-semibold text-primary-foreground">
            {getInitials(name)}
          </div>
        )}
        <div>
          <p className="font-heading text-sm font-medium tracking-wide text-accent uppercase">
            {about?.headline ?? "Aulas de inglês"}
          </p>
          <h1 className="mt-1 font-heading text-4xl font-bold text-primary">
            {name}
          </h1>
        </div>
      </div>

      <p className="mt-8 whitespace-pre-line text-muted-foreground">
        {about?.bio ?? "Em breve, uma apresentação completa aqui."}
      </p>

      {about?.credentials && about.credentials.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {about.credentials.map((credential) => (
            <li
              key={credential}
              className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
            >
              {credential}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 flex gap-4">
        <Link
          href="/metodologia"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Ver material de estudo
        </Link>
        <Link
          href="/contato"
          className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-muted"
        >
          Entrar em contato
        </Link>
      </div>
    </div>
  )
}

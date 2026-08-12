import { getContactContent } from "@/lib/queries/content"

export default async function ContatoPage() {
  const contact = await getContactContent()

  const whatsappHref = contact
    ? `https://wa.me/${contact.whatsapp_number}?text=${encodeURIComponent(
        contact.whatsapp_message
      )}`
    : null

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading text-3xl font-bold text-primary">Contato</h1>
      <p className="mt-2 text-muted-foreground">
        Fale comigo pelo WhatsApp pra tirar dúvidas ou agendar uma aula.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-whatsapp px-6 py-3 text-sm font-medium text-whatsapp-foreground hover:opacity-90"
          >
            Chamar no WhatsApp
          </a>
        )}
        {contact?.email && (
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center justify-center rounded-lg border px-6 py-3 text-sm font-medium hover:bg-muted"
          >
            {contact.email}
          </a>
        )}
      </div>
    </div>
  )
}

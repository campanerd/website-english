"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/slug"
import { topicFormSchema } from "@/lib/validations/topic"

export type CreateTopicState = {
  error: string | null
}

export async function createTopic(
  _prevState: CreateTopicState,
  formData: FormData
): Promise<CreateTopicState> {
  const parsed = topicFormSchema.safeParse({
    level_id: formData.get("level_id"),
    title: formData.get("title"),
    summary: formData.get("summary"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const pdf = formData.get("pdf")
  if (!(pdf instanceof File) || pdf.size === 0) {
    return { error: "Selecione um arquivo PDF." }
  }
  if (pdf.type !== "application/pdf") {
    return { error: "O arquivo precisa ser um PDF." }
  }

  const { level_id, title, summary } = parsed.data
  const slug = slugify(title)

  const supabase = await createClient()

  const { data: level, error: levelError } = await supabase
    .from("levels")
    .select("slug")
    .eq("id", level_id)
    .single()

  if (levelError || !level) {
    return { error: "Nível não encontrado." }
  }

  const { count } = await supabase
    .from("topics")
    .select("id", { count: "exact", head: true })
    .eq("level_id", level_id)

  const pdfPath = `${level.slug}/${slug}.pdf`

  const { error: uploadError } = await supabase.storage
    .from("topic-pdfs")
    .upload(pdfPath, pdf, { upsert: true, contentType: "application/pdf" })

  if (uploadError) {
    return { error: "Falha ao enviar o PDF: " + uploadError.message }
  }

  const { error: insertError } = await supabase.from("topics").insert({
    level_id,
    slug,
    title,
    summary: summary || null,
    pdf_path: pdfPath,
    pdf_original_name: pdf.name,
    order_index: count ?? 0,
    is_published: true,
  })

  if (insertError) {
    return { error: "Falha ao salvar o tópico: " + insertError.message }
  }

  revalidatePath("/")
  revalidatePath("/metodologia")
  revalidatePath(`/metodologia/${level.slug}`)

  redirect("/admin")
}

export type DeleteTopicState = {
  error: string | null
}

export async function deleteTopic(
  _prevState: DeleteTopicState,
  formData: FormData
): Promise<DeleteTopicState> {
  const id = formData.get("id")
  if (typeof id !== "string" || !id) {
    return { error: "Tópico inválido." }
  }

  const supabase = await createClient()

  const { data: topic, error: fetchError } = await supabase
    .from("topics")
    .select("pdf_path, level:levels(slug)")
    .eq("id", id)
    .single()

  if (fetchError || !topic) {
    return { error: "Tópico não encontrado." }
  }

  if (topic.pdf_path) {
    const { error: removeError } = await supabase.storage
      .from("topic-pdfs")
      .remove([topic.pdf_path])

    if (removeError) {
      return { error: "Falha ao apagar o PDF: " + removeError.message }
    }
  }

  const { error: deleteError } = await supabase.from("topics").delete().eq("id", id)

  if (deleteError) {
    return { error: "Falha ao apagar o tópico: " + deleteError.message }
  }

  revalidatePath("/")
  revalidatePath("/metodologia")
  if (topic.level) {
    revalidatePath(`/metodologia/${topic.level.slug}`)
  }
  revalidatePath("/admin/topicos")

  return { error: null }
}

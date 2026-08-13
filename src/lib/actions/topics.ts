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

  const [levelResult, countResult] = await Promise.all([
    supabase.from("levels").select("slug").eq("id", level_id).single(),
    supabase
      .from("topics")
      .select("id", { count: "exact", head: true })
      .eq("level_id", level_id),
  ])

  const { data: level, error: levelError } = levelResult
  if (levelError || !level) {
    return { error: "Nível não encontrado." }
  }

  const { count } = countResult
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

export type UpdateTopicState = {
  error: string | null
}

export async function updateTopic(
  _prevState: UpdateTopicState,
  formData: FormData
): Promise<UpdateTopicState> {
  const id = formData.get("id")
  if (typeof id !== "string" || !id) {
    return { error: "Tópico inválido." }
  }

  const parsed = topicFormSchema.safeParse({
    level_id: formData.get("level_id"),
    title: formData.get("title"),
    summary: formData.get("summary"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { level_id, title, summary } = parsed.data
  const newSlug = slugify(title)

  const supabase = await createClient()

  const [existingResult, newLevelResult] = await Promise.all([
    supabase
      .from("topics")
      .select("pdf_path, level:levels(slug)")
      .eq("id", id)
      .single(),
    supabase.from("levels").select("slug").eq("id", level_id).single(),
  ])

  const { data: existing, error: fetchError } = existingResult
  if (fetchError || !existing) {
    return { error: "Tópico não encontrado." }
  }

  const { data: newLevel, error: levelError } = newLevelResult
  if (levelError || !newLevel) {
    return { error: "Nível não encontrado." }
  }

  const newPdfPath = `${newLevel.slug}/${newSlug}.pdf`
  const oldPdfPath = existing.pdf_path
  const pathChanged = oldPdfPath !== null && oldPdfPath !== newPdfPath

  const pdf = formData.get("pdf")
  const hasNewFile = pdf instanceof File && pdf.size > 0
  const isPublished = formData.get("is_published") !== null

  if (hasNewFile) {
    if (pdf.type !== "application/pdf") {
      return { error: "O arquivo precisa ser um PDF." }
    }

    const { error: uploadError } = await supabase.storage
      .from("topic-pdfs")
      .upload(newPdfPath, pdf, { upsert: true, contentType: "application/pdf" })

    if (uploadError) {
      return { error: "Falha ao enviar o PDF: " + uploadError.message }
    }

    if (pathChanged) {
      await supabase.storage.from("topic-pdfs").remove([oldPdfPath])
    }
  } else if (pathChanged) {
    const { error: moveError } = await supabase.storage
      .from("topic-pdfs")
      .move(oldPdfPath, newPdfPath)

    if (moveError) {
      return { error: "Falha ao mover o PDF: " + moveError.message }
    }
  }

  const { error: updateError } = await supabase
    .from("topics")
    .update({
      level_id,
      slug: newSlug,
      title,
      summary: summary || null,
      pdf_path: hasNewFile || oldPdfPath ? newPdfPath : null,
      is_published: isPublished,
      ...(hasNewFile ? { pdf_original_name: pdf.name } : {}),
    })
    .eq("id", id)

  if (updateError) {
    return { error: "Falha ao salvar as alterações: " + updateError.message }
  }

  revalidatePath("/")
  revalidatePath("/metodologia")
  revalidatePath(`/metodologia/${newLevel.slug}`)
  if (existing.level) {
    revalidatePath(`/metodologia/${existing.level.slug}`)
  }
  revalidatePath("/admin/topicos")

  redirect("/admin/topicos")
}

import { createClient } from "@/lib/supabase/server"

export type TopicWithPdfUrl = {
  id: string
  slug: string
  title: string
  summary: string | null
  pdfUrl: string | null
}

export type LevelWithTopics = {
  id: string
  slug: string
  title: string
  description: string | null
  topics: TopicWithPdfUrl[]
}

export async function getPublishedLevelsWithTopics(): Promise<LevelWithTopics[]> {
  const supabase = await createClient()

  const { data: levels, error } = await supabase
    .from("levels")
    .select(
      "id, slug, title, description, topics(id, slug, title, summary, pdf_path, is_published, order_index)"
    )
    .eq("is_published", true)
    .eq("topics.is_published", true)
    .order("order_index", { ascending: true })
    .order("order_index", { referencedTable: "topics", ascending: true })

  if (error) throw error

  return (levels ?? []).map((level) => ({
    id: level.id,
    slug: level.slug,
    title: level.title,
    description: level.description,
    topics: (level.topics ?? []).map((topic) => ({
      id: topic.id,
      slug: topic.slug,
      title: topic.title,
      summary: topic.summary,
      pdfUrl: topic.pdf_path
        ? supabase.storage.from("topic-pdfs").getPublicUrl(topic.pdf_path).data
            .publicUrl
        : null,
    })),
  }))
}

export async function getPublishedLevelBySlug(
  slug: string
): Promise<LevelWithTopics | null> {
  const supabase = await createClient()

  const { data: level, error } = await supabase
    .from("levels")
    .select(
      "id, slug, title, description, topics(id, slug, title, summary, pdf_path, is_published, order_index)"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("topics.is_published", true)
    .order("order_index", { referencedTable: "topics", ascending: true })
    .maybeSingle()

  if (error) throw error
  if (!level) return null

  return {
    id: level.id,
    slug: level.slug,
    title: level.title,
    description: level.description,
    topics: (level.topics ?? []).map((topic) => ({
      id: topic.id,
      slug: topic.slug,
      title: topic.title,
      summary: topic.summary,
      pdfUrl: topic.pdf_path
        ? supabase.storage.from("topic-pdfs").getPublicUrl(topic.pdf_path).data
            .publicUrl
        : null,
    })),
  }
}

export type LevelOption = {
  id: string
  slug: string
  title: string
}

export async function getAllLevels(): Promise<LevelOption[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("levels")
    .select("id, slug, title")
    .order("order_index", { ascending: true })

  if (error) throw error
  return data ?? []
}

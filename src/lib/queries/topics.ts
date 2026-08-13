import { createClient } from "@/lib/supabase/server"

export type AdminTopic = {
  id: string
  slug: string
  title: string
  summary: string | null
  is_published: boolean
  level: {
    id: string
    slug: string
    title: string
  }
}

export async function getAllTopicsForAdmin(): Promise<AdminTopic[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("topics")
    .select(
      "id, slug, title, summary, is_published, order_index, level:levels(id, slug, title, order_index)"
    )

  if (error) throw error

  return (data ?? [])
    .map((topic) => ({
      id: topic.id,
      slug: topic.slug,
      title: topic.title,
      summary: topic.summary,
      is_published: topic.is_published,
      order_index: topic.order_index,
      level: topic.level,
    }))
    .sort((a, b) => {
      const levelDiff = a.level.order_index - b.level.order_index
      return levelDiff !== 0 ? levelDiff : a.order_index - b.order_index
    })
}

export type AdminTopicDetail = {
  id: string
  level_id: string
  slug: string
  title: string
  summary: string | null
  pdf_path: string | null
  pdf_original_name: string | null
  is_published: boolean
}

export async function getTopicById(
  id: string
): Promise<AdminTopicDetail | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("topics")
    .select(
      "id, level_id, slug, title, summary, pdf_path, pdf_original_name, is_published"
    )
    .eq("id", id)
    .maybeSingle()

  if (error) throw error
  return data
}

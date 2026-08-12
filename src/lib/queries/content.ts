import { createClient } from "@/lib/supabase/server"

type AboutContentRaw = {
  name: string
  headline: string
  bio: string
  photo_path: string | null
  credentials: string[]
}

export type AboutContent = {
  name: string
  headline: string
  bio: string
  photoUrl: string | null
  credentials: string[]
}

export type ContactContent = {
  whatsapp_number: string
  whatsapp_message: string
  email: string
  instagram?: string
  facebook?: string
}

export async function getAboutContent(): Promise<AboutContent | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("key", "about")
    .maybeSingle()

  if (error) throw error
  const raw = data?.content as AboutContentRaw | undefined
  if (!raw) return null

  return {
    name: raw.name,
    headline: raw.headline,
    bio: raw.bio,
    credentials: raw.credentials,
    photoUrl: raw.photo_path
      ? supabase.storage.from("site-images").getPublicUrl(raw.photo_path).data
          .publicUrl
      : null,
  }
}

export async function getContactContent(): Promise<ContactContent | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("key", "contact")
    .maybeSingle()

  if (error) throw error
  return (data?.content as ContactContent) ?? null
}

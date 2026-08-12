import { z } from "zod"

export const topicFormSchema = z.object({
  level_id: z.string().min(1, "Selecione um nível"),
  title: z.string().min(1, "Título é obrigatório"),
  summary: z.string().optional(),
})

export type TopicFormValues = z.infer<typeof topicFormSchema>
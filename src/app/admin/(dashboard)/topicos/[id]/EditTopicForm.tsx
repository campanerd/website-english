"use client"

import { useActionState } from "react"
import { updateTopic, type UpdateTopicState } from "@/lib/actions/topics"
import type { LevelOption } from "@/lib/queries/levels"
import type { AdminTopicDetail } from "@/lib/queries/topics"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const initialState: UpdateTopicState = { error: null }

export function EditTopicForm({
  topic,
  levels,
}: {
  topic: AdminTopicDetail
  levels: LevelOption[]
}) {
  const [state, formAction, isPending] = useActionState(
    updateTopic,
    initialState
  )

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={topic.id} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="level_id">Nível</Label>
        <Select
          name="level_id"
          defaultValue={topic.level_id}
          items={levels.map((level) => ({ value: level.id, label: level.title }))}
        >
          <SelectTrigger id="level_id" className="w-full">
            <SelectValue placeholder="Selecione um nível" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((level) => (
              <SelectItem key={level.id} value={level.id}>
                {level.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" required defaultValue={topic.title} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="summary">Descrição curta (opcional)</Label>
        <Textarea
          id="summary"
          name="summary"
          rows={2}
          maxLength={160}
          defaultValue={topic.summary ?? ""}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="pdf">Arquivo PDF</Label>
        {topic.pdf_original_name && (
          <p className="text-sm text-muted-foreground">
            Arquivo atual: {topic.pdf_original_name}
          </p>
        )}
        <Input id="pdf" name="pdf" type="file" accept="application/pdf" />
        <p className="text-xs text-muted-foreground">
          Deixe em branco pra manter o arquivo atual.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="is_published"
          name="is_published"
          defaultChecked={topic.is_published}
        />
        <Label htmlFor="is_published">Publicado (visível no site)</Label>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={isPending} className="mt-2 self-start">
        {isPending ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  )
}

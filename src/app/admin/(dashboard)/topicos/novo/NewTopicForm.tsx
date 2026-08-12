"use client"

import { useActionState } from "react"
import { createTopic, type CreateTopicState } from "@/lib/actions/topics"
import type { LevelOption } from "@/lib/queries/levels"
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

const initialState: CreateTopicState = { error: null }

export function NewTopicForm({ levels }: { levels: LevelOption[] }) {
  const [state, formAction, isPending] = useActionState(
    createTopic,
    initialState
  )

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="level_id">Nível</Label>
        <Select
          name="level_id"
          defaultValue={levels[0]?.id}
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
        <Input id="title" name="title" required placeholder="Ex: Afirmações" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="summary">Descrição curta (opcional)</Label>
        <Textarea
          id="summary"
          name="summary"
          rows={2}
          placeholder="Uma linha explicando o conteúdo do PDF"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="pdf">Arquivo PDF</Label>
        <Input id="pdf" name="pdf" type="file" accept="application/pdf" required />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={isPending} className="mt-2 self-start">
        {isPending ? "Salvando..." : "Criar Tópico"}
      </Button>
    </form>
  )
}

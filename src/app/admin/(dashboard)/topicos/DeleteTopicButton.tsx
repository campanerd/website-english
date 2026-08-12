"use client"

import { useActionState } from "react"
import { deleteTopic, type DeleteTopicState } from "@/lib/actions/topics"
import { Button } from "@/components/ui/button"

const initialState: DeleteTopicState = { error: null }

export function DeleteTopicButton({ id, title }: { id: string; title: string }) {
  const [state, formAction, isPending] = useActionState(deleteTopic, initialState)

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (
          !confirm(`Apagar o tópico "${title}"? Essa ação não pode ser desfeita.`)
        ) {
          event.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="outline" size="sm" disabled={isPending}>
        {isPending ? "Apagando..." : "Excluir"}
      </Button>
      {state.error && (
        <p className="mt-1 text-xs text-destructive">{state.error}</p>
      )}
    </form>
  )
}

import { getAllLevels } from "@/lib/queries/levels"
import { NewTopicForm } from "./NewTopicForm"

export default async function NewTopicPage() {
  const levels = await getAllLevels()

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-primary">
        Novo Tópico
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Escolha o nível, dê um título e anexe o PDF do material.
      </p>

      <div className="mt-6 max-w-lg">
        <NewTopicForm levels={levels} />
      </div>
    </div>
  )
}

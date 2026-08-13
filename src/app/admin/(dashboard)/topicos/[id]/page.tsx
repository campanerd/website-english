import { notFound } from "next/navigation"
import { getTopicById } from "@/lib/queries/topics"
import { getAllLevels } from "@/lib/queries/levels"
import { EditTopicForm } from "./EditTopicForm"

export default async function EditTopicPage(
  props: PageProps<"/admin/topicos/[id]">
) {
  const { id } = await props.params
  const [topic, levels] = await Promise.all([
    getTopicById(id),
    getAllLevels(),
  ])

  if (!topic) notFound()

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-primary">
        Editar Tópico
      </h2>

      <div className="mt-6 max-w-lg">
        <EditTopicForm topic={topic} levels={levels} />
      </div>
    </div>
  )
}

import Link from "next/link"
import { getAllTopicsForAdmin } from "@/lib/queries/topics"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteTopicButton } from "./DeleteTopicButton"

export default async function TopicsListPage() {
  const topics = await getAllTopicsForAdmin()

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold text-primary">
          Tópicos
        </h2>
        <Button render={<Link href="/admin/topicos/novo" />} nativeButton={false}>
          Novo Tópico
        </Button>
      </div>

      {topics.length === 0 ? (
        <p className="mt-8 text-muted-foreground">
          Nenhum tópico criado ainda.
        </p>
      ) : (
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Nível</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map((topic) => (
              <TableRow key={topic.id}>
                <TableCell>{topic.level.title}</TableCell>
                <TableCell>{topic.title}</TableCell>
                <TableCell>
                  {topic.is_published ? "Publicado" : "Rascunho"}
                </TableCell>
                <TableCell className="text-right">
                  <DeleteTopicButton id={topic.id} title={topic.title} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminDashboardPage() {
  return (
    <div>
      <p className="text-muted-foreground">
        Gerencie o material de estudo publicado no site.
      </p>
      <Button
        render={<Link href="/admin/topicos" />}
        nativeButton={false}
        className="mt-4"
      >
        Gerenciar Tópicos
      </Button>
    </div>
  )
}
